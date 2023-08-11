import { RequestStatusKontrol, RequestEdit } from '~/apollo/mutation/Request'
import { SubscriptionCurAbonError, SubscriptionAbon } from '~/apollo/subscription/Abon'
import { AbonSelectFromBillingId } from '~/apollo/query/Abon'
import ControlRequestModel from '~/model/Request/ControlRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'
import QualityModel from '~/model/Quality/QualityModel'

export default {
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