<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :search="search" :custom-filter="filterAbons" :items="filteredAbons" class="elevation-1" hide-default-footer
        :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-text-field prepend-inner-icon="mdi-magnify" label="Поиск" v-model="search" class="mt-7" outlined
                rounded clearable></v-text-field>
              <v-select class="mt-7 ml-3 mr-3" outlined prepend-inner-icon="mdi-magnify" label="Поиск по ошибкам"
                :items="errors" v-model="error" clearable rounded></v-select>
              <v-btn :disabled="!$store.state.permissionList.includes('MFIFilesAdmin') || loader === true"
                title="Обновить список ошибок" class="primary ml-3 mr-2" icon dark @click="update">
                <KeepAlive>
                  <v-icon v-if="!loader">mdi-autorenew</v-icon>
                  <v-icon class="loader">mdi-autorenew</v-icon>
                </KeepAlive>
              </v-btn>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="editAbonDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Редактирование</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-text-field v-model="editedAbon.coment" label="Комментарий" outlined></v-text-field>
                </v-container>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn title="Подтвердить изменения" @click="acceptEditAbon" icon large dark class="success">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>

          <v-dialog v-model="errorsDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Список ошибок</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <li v-for="(error, i) in editedAbon.abonErrors" :key="i">
                    <span>{{ error }}</span>
                  </li>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <KeepAlive v-if="editedAbon.auswais !== undefined">
            <v-dialog v-model="passDataDialog" max-width="600px">
              <v-card>
                <v-card-title class="justify-center">
                  <span>Пасспортные данные</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field label="Кем выдан" v-model="editedAbon.auswais.kem" disabled></v-text-field>
                    <v-text-field label="От" v-model="editedAbon.auswais.ot" disabled></v-text-field>
                    <v-text-field label="Серия" v-model="editedAbon.auswais.seria" disabled></v-text-field>
                    <v-text-field label="Номер" v-model="editedAbon.auswais.number" disabled></v-text-field>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </KeepAlive>
        </template>

        <template v-slot:item.editAbon="{ item }">
          <v-btn :disabled="!$store.state.permissionList.includes('MFIFilesAdmin')" title="Редактировать Абонента" icon
            dark class="primary" @click="editAbon(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        </template>
        <template v-slot:item.errorsList="{ item }">
          <v-btn title="Список ошибок" icon dark class="error"
            @click="errorList(item)"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
        </template>
        <template v-slot:item.passData="{ item }">
          <v-btn title="Пасспортные данные" icon class="black" dark
            @click="passData(item)"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import { UfmsCheckUFMSError } from '~/apollo/mutation/Ufms'
import { AbonErrorEdit } from '~/apollo/mutation/AbonError'
import { delay } from 'q'
import AbonErrorModel from '~/model/AbonError/AbonErrorModel'

export default {
  components: { RoutePanel },
  mixins: [AbonErrorModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 25,
      apolloLoading: true,
      editAbonDialog: false,
      errorsDialog: false,
      passDataDialog: false,
      loader: false,
      search: "",
      titles: [
        { text: "Биллинг ID", align: "center", value: "billingAbonId" },
        { text: "ФИО", align: "center", value: "full_name" },
        { text: "Комментарий", align: "center", value: "coment" },
        { text: "Пасспортные данные", align: "center", value: "passData", sortable: false },
        { text: "Ошибки", align: "center", value: "errorsList", sortable: false },
        { text: "", align: "center", value: "editAbon", sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'МФИ Файлы', path: '/mfi' },
      ],
      errors: [
        "Необходимо заполнить день рождения",
        "Необходимо заполнить не структурированные паспортные данные",
        "Длина неструктурированных паспортных данных не может превышать 1024 символа",
        "Не верно заполнена серия пасспорта - должно быть 4 цифры",
        "Серия документа не должна превышать 16 символов",
        "Не верно заполнена Номер пасспорта - должно быть 6 цифры",
        "Номер документа не должна превышать 16 символов",
        "Дата выдачи документа указанна не верно от 8 до 10 символов",
        "Не верно указан код УФМС России. Пример: 900-003",
        "Когда и кем выдан документ не должен превышать 512 символов",
        "Указанного кода УФМС нет в справочнике",
        "Необходимо правильно заполнить ФИО",
        "Необходимо заполнить прописку или адрес проживания",
        "Необходимо заполнить ИНН",
        "Не верно указан банковский счет от 1 - 30 символов"
      ],
      error: "",
      abons: [],
      editedAbon: {},
    };
  },
  async mounted() {
    const { data, subscription } = await this.getAbonError()
    this.abons = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      this.context.loader = false

      const billingIdArray = this.context.abons.map(abon => abon.billingAbonId)
      if (!billingIdArray.includes(data.Subscription_AbonError.billingAbonId)) {
        this.context.abons.push(data.Subscription_AbonError)
      }

      if (billingIdArray.includes(data.Subscription_AbonError.billingAbonId)) {
        this.context.abons = this.context.abons.map(abon => {
          if (abon.billingAbonId === data.Subscription_AbonError.billingAbonId) {
            abon = data.Subscription_AbonError
          }

          return abon
        })
      }
    })
  },
  computed: {
    filteredAbons() {
      return this.abons.filter(abon => {
        return !this.error || (abon.abonErrors.includes(this.error));
      });
    }
  },
  methods: {
    filterAbons(value, search, item) {
      return search === Array.prototype.slice.call(item.full_name, 0, search.length).join("")
        || search === Array.prototype.slice.call(item.billingAbonId, 0, search.length).join("");
    },
    update() {
      delay(this.loader = true, 5000).then(() => this.loader = false);
      this.apolloMutation(UfmsCheckUFMSError);
    },
    async editAbon(item) {
      this.editedAbon = item;
      this.editAbonDialog = true;
    },
    async acceptEditAbon() {
      this.apolloMutation(AbonErrorEdit, {
        param: {
          coment: this.editedAbon.coment
        },
        idList: [this.editedAbon.billingAbonId]
      });
      this.editAbonDialog = false;
    },
    async passData(item) {
      this.editedAbon = item;
      this.passDataDialog = true;
    },
    async errorList(item) {
      this.editedAbon = item;
      this.errorsDialog = true;
    },
  },
}
</script>