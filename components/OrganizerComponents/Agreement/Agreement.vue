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
              <v-text-field width="10px" class="mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Фамилия"
                v-model="search" outlined rounded clearable />
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Заключение договора</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.familiya" label="Фамилия"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-row>
                        <v-col cols="10">
                          <v-text-field label="Лицевой счет" v-model="editedReq.abonAccountId"></v-text-field>
                        </v-col>
                        <v-col class="d-flex align-center" cols="2">
                          <v-btn :disabled="!editedReq.abonAccountId" title="Добавить лицевой счет" class="primary" icon
                            dark @click="takeAbon">
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.name" label="Имя"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.passport" label="Паспорт"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.otchestvo" label="Отчество"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.full_name" label="ФИО"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.adres" label="Адрес"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.actual_address" label="Адрес"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.fone" label="Телефон"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field disabled v-model="abon.mobile_telephone" label="Телефон"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6"></v-col>
                    <v-col cols="6">
                      <v-menu :disabled="abonError === undefined" v-model="menu" :close-on-content-click="false"
                        :nudge-width="200" offset-x open-on-hover>
                        <template v-slot:activator="{ on, attrs }">
                          <KeepAlive>
                            <v-btn v-if="abon.errorList !== undefined" class="mt-3 mb-5 error" icon dark v-bind="attrs"
                              v-on="on">
                              <v-icon>mdi-alert-circle-outline</v-icon>
                            </v-btn>
                          </KeepAlive>
                        </template>
                        <v-list>
                          <v-list-item v-for="(error, i) in abon.errorList" :key="i">
                            <v-list-item-title>{{ error }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>

                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container>
                  <v-row>
                    <v-col class="text-center" cols="6">
                      <v-btn title="Подтвердить заявку" class="success" dark icon large @click="agreeReq">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col class="text-center" cols="6">
                      <v-btn title="Отклонить заявку" class="red" icon large dark @click="checkDecline">
                        <v-icon>mdi-window-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="linkAbonDialog" max-width="320px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span class="text-center">Хотите привязать абонента к заявке ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="acceptLinkAbon">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="declineLinkAbon">Нет</v-btn>
                <v-spacer></v-spacer>
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

          <v-dialog v-model="declineReqDialog" max-width="600px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Выберите причину отказа</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-container>
                  <v-row>
                    <v-col class="text-center" cols="12">
                      <v-combobox v-model="editedReq.qualityControlNameList" :items="qualityControlOtkazListName"
                        label="Причина" multiple chips outlined clearable></v-combobox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center" cols="12">
                      <v-btn dark class="red" @click="acceptReqDecline">Отказать</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.checkReq="{ item }">
          <v-btn :disabled="item.isTexStatus === true" dark icon class="primary" @click="checkReq(item)">
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
import { RequestZakluchenieDogovor, RequestEdit, RequestDeleteStatus } from '~/apollo/mutation/Request'
import { SubscriptionAbon, SubscriptionCurAbonError } from '~/apollo/subscription/Abon'
import { AbonSelectFromBillingId } from '~/apollo/query/Abon'
import AgreementRequestModel from '~/model/Request/AgreementRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'

export default {
  components: { RoutePanel },
  mixins: [AgreementRequestModel, RequestTarifModel, TypeQualityModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      dialog: false,
      deleteDialog: false,
      declineReqDialog: false,
      menu: false,
      linkAbonDialog: false,
      titles: [
        { text: 'Фамилия', align: 'center', value: 'familiya' },
        { text: 'Адрес', align: 'center', value: 'adres' },
        { text: 'Тариф', align: "center", value: "tarifName" },
        { text: "Прошло времени", align: "center", value: "passedTime" },
        { text: "", align: "center", value: "checkReq", sortable: false },
        { text: "", align: "center", value: "deleteStatus", sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Заключение договора', path: '/agreement' },
      ],
      requests: [],
      apolloLoading: true,
      editedReq: {},
      tarifs: [],
      tarifId: [],
      abon: {},
      abonError: {},
      qualityControlOtkazListName: [],
      qualityControlOtkazList: [],
    }
  },
  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        const statusList = req.status.map(stts => stts.namestatus);
        if (statusList.includes("Подключение")) {
          req.isTexStatus = true
        }
        req.qualityControlNameList = [];
        req.qualityControlIdList = [];
        req.qualityControlIdList.forEach(id => {
          this.qualityControlOtkazList.forEach(qC => {
            if (qC.id === id) {
              req.qualityControlNameList.push(qC.name);
            }
          })
        })

        let allTime;

        req.status.forEach(stts => {
          if (stts.namestatus === "Заключение договора") {
            allTime = stts.DateStart;
          }
        });

        const correctDate = new Date(Date.parse(allTime))

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
    const req = await this.getAgreeRequest()
    this.requests = req.data
    this.apolloLoading = this.$apollo.loading

    req.subscription((data) => {
      const statusList = data.Subscription_Request.status.map(stts => stts.namestatus)

      if (data.Subscription_Request.adres !== 'Удален' && statusList.includes('Заключение договора')) {
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
          if (!reqStatusList.includes('Подключение')) {
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
    this.tarifId = tarifs.data.map(tarif => tarif.id)
    this.tarifs = tarifs.data

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

    const rejectQuality = await this.getQualityFromType('Отказ')
    this.qualityControlOtkazListName = rejectQuality.data.map(qControl => qControl.name)
    this.qualityControlOtkazList = rejectQuality.data
  },

  methods: {
    async acceptReqDecline() {
      this.apolloMutation(RequestZakluchenieDogovor, {
        id: this.editedReq.id,
        type: "Отказ"
      })

      if (this.editedReq.qualityControlNameList !== undefined) {
        this.qualityControlOtkazList.forEach(qC => {
          this.editedReq.qualityControlNameList.forEach(name => {
            if (qC.name === name) {
              this.editedReq.qualityControlIdList.push(qC.id);
            }
          })
        })

        this.apolloMutation(RequestEdit, {
          idList: [this.editedReq.id],
          param: {
            qualityControlIdList: this.editedReq.qualityControlIdList
          }
        })
      }

      this.declineReqDialog = false;
      this.dialog = false;
    },
    async declineReqDecline() {
      this.declineReqDialog = false;
    },
    async checkDecline() {
      this.declineReqDialog = true;
    },
    async deleteStatus(item) {
      this.editedReq = item;
      this.deleteDialog = true;
    },
    async acceptDelete() {
      this.apolloMutation(RequestDeleteStatus, {
        idList: [this.editedReq.id]
      });
      this.deleteDialog = false;
    },
    async declineDelete() {
      this.deleteDialog = false;
    },
    async checkReq(item) {
      this.editedReq = item;

      if (item.abonAccountId) {
        this.subAbon()
      } else {
        this.abon = {}
      }

      this.dialog = true;
    },
    async agreeReq() {
      this.apolloMutation(RequestZakluchenieDogovor, {
        id: this.editedReq.id,
        type: "Подключение"
      })

      this.dialog = false;
    },
    async takeAbon() {
      this.subAbon()

      this.linkAbonDialog = true;
    },
    async acceptLinkAbon() {
      this.apolloMutation(RequestEdit, {
        param: {
          abonAccountId: this.editedReq.abonAccountId,
          abonId: this.abon.id
        },
        idList: [this.editedReq.id]
      })

      this.declineLinkAbon();
    },
    async declineLinkAbon() {
      this.linkAbonDialog = false;
    },
    async subAbon() {
      this.$apollo.addSmartSubscription("abonentError", {
        query: SubscriptionCurAbonError,
        variables: {
          billingIdList: [this.editedReq.abonAccountId]
        },
        result({ data }) {
          this.abonError = data.Subscription_CurAbonError
          if (this.abonError !== undefined) {
            if (this.abon.id === this.abonError.id) {
              this.abon.errorList = this.abonError.errorList;
            }
          }
        }
      })

      this.$apollo.addSmartSubscription("abonent", {
        query: SubscriptionAbon,
        variables: {
          watch: {
            id: true,
            full_name: true,
            passport: true,
            actual_address: true,
            mobile_telephone: true,
            is_juridical: true
          },
          param: {
            id: true,
            full_name: true,
            passport: true,
            actual_address: true,
            mobile_telephone: true,
            is_juridical: true
          },
          billingIdList: [this.editedReq.abonAccountId]
        },
        result({ data }) {
          this.abon = data.Subscription_Abon;
        }
      })

      this.apolloQuery(AbonSelectFromBillingId, {
        billingIdList: [this.editedReq.abonAccountId]
      })
    }
  },
}
</script>