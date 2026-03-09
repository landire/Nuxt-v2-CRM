<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :search="codeUfms" :custom-filter="filterCodeUfms" :loading="apolloLoading"
        :loading-text="'Идет загрузка данных...'" :headers="titles" :items="ufms" class="elevation-1"
        hide-default-footer :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Справочник отделений УФМС</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field prepend-inner-icon="mdi-magnify" class="mt-7" v-model="codeUfms" label="Поиск по коду"
                outlined rounded clearable></v-text-field>
              <v-spacer></v-spacer>
              <UfmsCreate class="mr-3 mt-1" />
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Редактирование</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedUfms.name" label="Кем выдан"></v-text-field>
                      <v-text-field v-model="editedUfms.structureCod" label="Код подразделения"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn title="Подтвердить" class="success" icon dark large @click="save">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>

          <v-dialog v-model="ufmsDeleteDialog" max-width="300px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Вы уверены ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptDeleteUfms">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineDeleteUfms">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.editUfms="{ item }">
          <v-btn title="Редактировать УФМС" icon dark class="primary"
            @click="editUfms(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        </template>
        <template v-slot:item.deleteUfms="{ item }">
          <v-btn title="Удалить УФМС" icon dark class="red"
            @click="deleteUfms(item)"><v-icon>mdi-delete</v-icon></v-btn>
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
import UfmsCreate from '~/components/ButtonComponents/Ufms/UfmsCreate.vue'
import { UfmsEdit, UfmsDelete } from '~/apollo/mutation/Ufms'
import UfmsModel from '~/model/Ufms/UfmsModel'

export default {
  components: { UfmsCreate, RoutePanel },
  mixins: [UfmsModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      dialog: false,
      ufmsDeleteDialog: false,
      apolloLoading: true,
      titles: [
        { text: 'Кем выдан', align: 'center', value: 'name' },
        { text: 'Код подразделения', align: 'center', value: 'structureCod' },
        { text: '', align: 'center', value: 'editUfms', sortable: false },
        { text: '', align: 'center', value: 'deleteUfms', sortable: false }
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Справочник отделений УФМС', path: '/ufms' },
      ],
      ufms: [],
      editedUfms: {},
      codeUfms: '',
    }
  },

  async mounted() {
    const { data, subscription } = await this.getUfms()
    this.ufms = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      if (data.Subscription_Ufms.name !== 'Удален') {
        const idArray = this.ufms.map(ufms => ufms.id)
        if (!idArray.includes(data.Subscription_Ufms.id)) {
          this.ufms.push(data.Subscription_Ufms)
        }
        if (idArray.includes(data.Subscription_Ufms.id)) {
          this.ufms = this.ufms.map(ufms => {
            if (ufms.id === data.Subscription_Ufms.id) {
              ufms = data.Subscription_Ufms
            }
            return ufms
          })
        }
      } else {
        this.ufms = this.ufms.map(ufms => {
          if (ufms.id === data.Subscription_Ufms.id) {
            ufms = data.Subscription_Ufms
          }
          return ufms
        })
        this.ufms = this.ufms.filter(ufms => ufms.id !== data.Subscription_Ufms.id)
      }
    })
  },

  methods: {
    filterCodeUfms(value, search, item) {
      if (search.length >= 3) {
        return search === Array.prototype.slice.call(item.structureCod, 0, search.length).join('')
      }
      return value
    },

    // Метод кнопки Редактирования Роли
    async editUfms(item) {
      this.editedUfms = item
      this.dialog = true
    },
    // Метод кнопки сохранения измененной Роли
    async save() {
      this.apolloMutation(UfmsEdit, {
        idList: [this.editedUfms.id],
        param: {
          name: this.editedUfms.name,
          structureCod: this.editedUfms.structureCod
        }
      })
      this.dialog = false
    },
    // Метод кнопки Удаления Роли
    async deleteUfms(item) {
      this.editedUfms = item
      this.ufmsDeleteDialog = true
    },
    // Метод кнопки отмены Удаления Роли
    async declineDeleteUfms() {
      this.ufmsDeleteDialog = false
    },
    // Метод кнопки принятия Удаления Роли
    async acceptDeleteUfms() {
      this.apolloMutation(UfmsDelete, {
        idList: [this.editedUfms.id]
      })
      this.declineDeleteUfms()
    }
  },
}
</script>