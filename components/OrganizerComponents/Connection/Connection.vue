<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" class="elevation-1"
        hide-default-footer :search="search" :headers="titles" :items="updateRequest" :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field width="10px" class="mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Поиск"
                v-model="search" outlined rounded />
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Подключение</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field disabled v-model="editedReq.familiya" label="Фамилия"></v-text-field>
                      <v-text-field disabled v-model="editedReq.name" label="Имя"></v-text-field>
                      <v-text-field disabled v-model="editedReq.otchestvo" label="Отчество"></v-text-field>
                      <v-text-field disabled v-model="editedReq.adres" label="Адрес"></v-text-field>
                      <v-text-field disabled v-model="editedReq.fone" label="Телефон"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container>
                  <div class="d-flex justify-center">
                    <v-select style="max-width: 60%;" :menu-props="{ offsetY: true }" label="Статус" :items="typeList"
                      v-model="editedReq.type" outlined clearable></v-select>
                  </div>
                  <v-row>
                    <v-col class="text-center" cols="12">
                      <v-btn title="Подтвердить статус" class="success" icon large dark @click="connectReq">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="deleteDialog" max-width="300px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Вы уверены ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptDelete">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineDelete">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.checkReq="{ item }">
          <v-btn icon dark class="primary" @click="checkReq(item)">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.deleteStatus="{ item }">
          <v-btn title="Откатить статус" icon dark class="red"
            @click="deleteStatus(item)"><v-icon>mdi-arrow-u-left-bottom</v-icon></v-btn>
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
import { RequestStatusPodkluchenie, RequestDeleteStatus } from '~/apollo/mutation/Request'
import ConnectionRequestModel from '~/model/Request/ConnectionRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'

export default {
  components: { RoutePanel },
  mixins: [ConnectionRequestModel, RequestTarifModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      dialog: false,
      deleteDialog: false,
      rejectDialog: false,
      editedReq: {},
      titles: [
        { text: "Фамилия", align: "center", value: "familiya" },
        { text: "Адрес", align: "center", value: "adres" },
        { text: "Тариф", align: "center", value: "tarifName" },
        { text: "Прошло времени", align: "center", value: "passedTime" },
        { text: "", align: "center", value: "checkReq", sortable: false },
        { text: "", align: "center", value: "deleteStatus", sortable: false },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Подключение", path: "/connection" },
      ],
      requests: [],
      typeList: ["Не верны параметры подключения", "Отказ", "Подключено"],
      apolloLoading: true,
      tarifs: [],
      tarifId: []
    }
  },
  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        let allTime
        // Выборка даты статуса с названием 'Подключение'   
        req.status.forEach(stts => {
          if (stts.namestatus === "Подключение") {
            allTime = stts.DateStart;
          }
        })
        // Корректировка времени (+3 ч)
        const correctDate = new Date(Date.parse(allTime));
        // Высчитывание прошедшего времени
        const psdTime = (Date.now() / 1000) - (Date.parse(correctDate) / 1000);
        if (Math.round(psdTime) <= 60) {
          req.passedTime = Math.round(psdTime) + " сек";
        }
        if (Math.round(psdTime) > 60 && Math.round(psdTime) <= 3600) {
          req.passedTime = (Math.round(psdTime / 60)) + " мин";
        }
        if (Math.round(psdTime) > 3600 && Math.round(psdTime) <= 86400) {
          req.passedTime = (Math.round(psdTime / 3600)) + " ч";
        }
        if (Math.round(psdTime) > 86400) {
          req.passedTime = (Math.round(psdTime / 86400)) + " д";
        }

        return req
      })

      this.requests = this.requests.map(req => {
        let tarifNames = [];
        req.tarifIdList.forEach(id => {
          if (!this.tarifId.includes(id)) {
            this.tarifs.push({ name: "ТАРИФ НЕДОСТУПЕН", id: id });
          }
        })

        this.tarifs.forEach(tarif => {
          if (req.tarifIdList.includes(tarif.id)) {
            tarifNames.push(" " + tarif.name);
            req.tarifName = tarifNames;
          }
        })

        return req
      })

      return this.requests
    }
  },
  async mounted() {
    const req = await this.getConnectRequest()
    this.requests = req.data
    this.apolloLoading = this.$apollo.loading

    req.subscription((data) => {
      const statusList = data.Subscription_Request.status.map(stts => stts.namestatus)

      if (data.Subscription_Request.adres !== 'Удален' && statusList.includes('Подключение')) {
        const idArray = this.requests.map(req => req.id)
        if (!idArray.includes(data.Subscription_Request.id)) {
          this.requests.push(data.Subscription_Request)
        }
        if (idArray.includes(data.Subscription_Request.id)) {
          this.requests = this.requests.map(req => {
            if (req.id === data.Subscription_Request.id) {
              req = data.Subscription_Request
            }
            return req
          })
        }

        this.requests = this.requests.filter(req => {
          const reqStatusList = req.status.map(stts => stts.namestatus)
          if (!reqStatusList.includes('Отказ') && !reqStatusList.includes('Не верны параметры подключения') && !reqStatusList.includes('Подключено')) {
            return req
          }
        })
      } else {
        this.requests = this.requests.map(req => {
          if (req.id === data.Subscription_Request.id) {
            req = data.Subscription_Request
          }
          return req
        })

        this.requests = this.requests.filter(req => req.id !== data.Subscription_Request.id)
      }
    })

    const tarifs = await this.getReqTarifs()
    this.tarifs = tarifs.data
    this.tarifId = tarifs.data.map(tarif => tarif.id)

    tarifs.subscription((data) => {
      if (!this.tarifId.includes(data.Subscription_Tarif.id)) {
        this.tarifId.push(data.Subscription_Tarif.id)
      }
      if (!this.tarifsName.includes(data.Subscription_Tarif.name)) {
        this.tarifsName.push(data.Subscription_Tarif.name)
      }

      this.tarifs = this.tarifs.map(tarif => {
        if (tarif.id === data.Subscription_Tarif.id) {
          if (tarif.name === 'ТАРИФ НЕДОСТУПЕН') {
            tarif = data.Subscription_Tarif
          } else {
            tarif = { name: 'ТАРИФ НЕДОСТУПЕН', id: data.Subscription_Tarif.id }
          }
        }
        return tarif
      })
    })
  },
  methods: {
    async deleteStatus(item) {
      this.editedReq = item;
      this.deleteDialog = true;
    },
    async acceptDelete() {
      this.apolloMutation(RequestDeleteStatus, {
        idList: [this.editedReq.id]
      })

      this.deleteDialog = false;
    },
    async declineDelete() {
      this.deleteDialog = false;
    },
    async checkReq(item) {
      this.editedReq = item;
      this.dialog = true;
    },
    async connectReq() {
      this.apolloMutation(RequestStatusPodkluchenie, {
        id: this.editedReq.id,
        type: this.editedReq.type
      })

      this.dialog = false;
    },
  },
}
</script>