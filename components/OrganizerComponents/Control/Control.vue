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
                v-model="search" outlined rounded clearable />
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Контроль</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field disabled v-model="editedReq.familiya" label="Фамилия"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <span>Оценка</span>
                      <v-rating color="#FBB117" background-color="black" v-model="editedReq.grade" hover></v-rating>
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
                  <div class="d-flex justify-center">
                    <v-combobox style="max-width: 70%;" v-model="editedReq.qualityControlNameList"
                      :items="qualityControlListName" label="Причина" multiple chips outlined clearable></v-combobox>
                  </div>
                  <v-row justify="center">
                    <v-col class="text-center" cols="12">
                      <v-btn title="Подтвердить заявку" class="success" icon large dark @click="controlReq">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.checkReq="{ item }">
          <v-btn dark icon class="primary" @click="checkReq(item)">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
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
import { RequestStatusKontrol, RequestEdit } from '~/apollo/mutation/Request'
import { SubscriptionCurAbonError, SubscriptionAbon } from '~/apollo/subscription/Abon'
import { AbonSelectFromBillingId } from '~/apollo/query/Abon'
import ControlRequestModel from '~/model/Request/ControlRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'
import QualityModel from '~/model/Quality/QualityModel'

export default {
  components: { RoutePanel },
  mixins: [ControlRequestModel, RequestTarifModel, TypeQualityModel, QualityModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      menu: false,
      search: '',
      dialog: false,
      editedReq: {},
      titles: [
        { text: 'Фамилия', align: 'center', value: 'familiya' },
        { text: 'Адрес', align: 'center', value: 'adres' },
        { text: 'Тариф', align: 'center', value: 'tarifName' },
        { text: 'Прошло времени', align: 'center', value: 'passedTime' },
        { text: '', align: 'center', value: 'checkReq', sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Контроль заявок', path: '/control' },
      ],
      requests: [],
      abon: {},
      abonError: {},
      apolloLoading: true,
      tarifs: [],
      tarifId: [],
      qualityControlList: [],
      qualityControlListName: [],
    }
  },
  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        let allTime
        // Выборка даты статуса с названием 'Подключено'   
        req.status.forEach(stts => {
          if (stts.namestatus === "Подключено") {
            allTime = stts.DateStart;
          }
        });
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
        req.qualityControlNameList = [];
        req.qualityControlIdList?.forEach(id => {
          this.qualityControlList.forEach(qC => {
            if (qC.id === id) {
              req.qualityControlNameList.push(qC.name);
            }
          })
        })

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
    const req = await this.getControlRequest()
    this.requests = req.data
    this.apolloLoading = this.$apollo.loading

    req.subscription((data) => {
      const statusList = data.Subscription_Request.status.map(stts => stts.namestatus)

      if (data.Subscription_Request.adres !== 'Удален') {
        const idArray = this.requests.map(req => req.id)
        if (!idArray.includes(data.Subscription_Request.id) && statusList.includes('Подключено')) {
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
          if (!reqStatusList.includes('Выполнено')) {
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

    const qualityCheck = await this.getQualityFromType('Качество')
    this.qualityControlListName = qualityCheck.data.map(qControl => qControl.name)

    const qualityAll = await this.getQuality()
    this.qualityControlList = qualityAll.data
  },

  methods: {
    async checkReq(item) {
      this.editedReq = item;
      this.dialog = true;
      this.$apollo.addSmartSubscription("abonentError", {
        query: SubscriptionCurAbonError,
        variables: {
          billingIdList: [item.abonId]
        },
        result({ data }) {
          this.abonError = data.Subscription_CurAbonError;
          if (this.abonError !== undefined) {
            if (this.abon.id === this.abonError.id) {
              this.abon.errorList = this.abonError.errorList;
            }
          }
        },
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
          billingIdList: [item.abonId]
        },
        result(data) {
          this.abon = data.data.Subscription_Abon;
        }
      });
      this.apolloQuery(AbonSelectFromBillingId, {
        billingIdList: [item.abonId]
      })
    },
    async controlReq() {
      if (this.editedReq.qualityControlNameList !== undefined) {
        this.qualityControlList.forEach(qC => {
          this.editedReq.qualityControlNameList.forEach(name => {
            if (qC.name === name) {
              this.editedReq.qualityControlIdList.push(qC.id);
            }
          })
        })
      }

      this.apolloMutation(RequestStatusKontrol, {
        id: this.editedReq.id,
        type: "Выполнено"
      })

      this.apolloMutation(RequestEdit, {
        idList: [this.editedReq.id],
        param: {
          ocenka: this.editedReq.grade,
          qualityControlIdList: this.editedReq.qualityControlIdList
        }
      })

      this.dialog = false;
    }
  },
}
</script>