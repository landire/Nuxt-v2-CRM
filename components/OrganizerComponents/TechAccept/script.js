import { RequestDeleteStatus, RequestProverkaTeh, RequestEdit } from '~/apollo/mutation/Request'
import TechRequestModel from '~/model/Request/TechRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'

export default {
  mixins: [TechRequestModel, RequestTarifModel, TypeQualityModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      tarifs: [],
      dialog: false,
      deleteDialog: false,
      rejectDialog: false,
      editedReq: {},
      apolloLoading: true,
      titles: [
        { text: "Фамилия", align: "center", value: "familiya" },
        { text: "Адрес", align: "center", value: "adres" },
        { text: "Тариф", align: "center", value: "tarifName" },
        { text: "Прошло времени", align: "center", value: "passedTime" },
        { text: "", align: "center", value: "techReq", sortable: false },
        { text: "", align: "center", value: "deleteStatus", sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Проверка тех. возможности', path: '/tech' },
      ],
      requests: [],
      tarifs: [],
      tarifId: [],
      tarifsName: [],
      qualityControlPokritieListName: [],
      qualityControlPokritieList: [],
    }
  },

  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        const statusList = req.status.map(stts => stts.namestatus);
        if (statusList.includes("Заключение договора")) {
          req.texStatus = true;
        }
        req.qualityControlNameList = [];
        req.qualityControlIdList = [];
        req.qualityControlIdList.forEach(id => {
          this.qualityControlPokritieList.forEach(qC => {
            if (qC.id === id) {
              req.qualityControlNameList.push(qC.name);
            }
          })
        })

        let allTime
        // Выборка даты статуса с названием 'Проверка тех. возможности'
        req.status.forEach(stts => {
          if (stts.namestatus === "Проверка тех возможности") {
            allTime = stts.DateStart;
          }
        })

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
        req.tarifIdList?.forEach(id => {
          if (!this.tarifId.includes(id)) {
            this.tarifs.push({ name: "ТАРИФ НЕДОСТУПЕН", id: id });
          }
        });
        this.tarifs.forEach(tarif => {
          if (req.tarifIdList?.includes(tarif.id)) {
            tarifNames.push(` ${tarif.name}`);
            req.tarifName = tarifNames;
          }
        })

        return req
      })

      return this.requests
    }
  },

  async mounted() {
    const req = await this.getTechRequest()
    this.requests = req.data
    this.apolloLoading = this.$apollo.loading

    req.subscription((data) => {
      const statusList = data.Subscription_Request.status.map(stts => stts.namestatus)

      if (data.Subscription_Request.adres !== 'Удален' && statusList.includes('Проверка тех возможности')) {
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
          if (!reqStatusList.includes('Заключение договора') && !reqStatusList.includes('Тех возможность отсутствует')) {
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

    const tarif = await this.getReqTarifs()
    this.tarifId = tarif.data.map(tarif => tarif.id)
    this.tarifsName = tarif.data.map(tarif => tarif.name)
    this.tarifs = tarif.data

    tarif.subscription((data) => {
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

    const coverageQuality = await this.getQualityFromType('Покрытие')
    this.qualityControlPokritieListName = coverageQuality.data.map(qControl => qControl.name)
    this.qualityControlPokritieList = coverageQuality.data
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
    async techReq(item) {
      this.editedReq = item;
      this.dialog = true;
    },
    async accept() {
      this.apolloMutation(RequestProverkaTeh, {
        id: this.editedReq.id,
        type: "Заключение договора"
      })

      this.dialog = false;
    },
    async reject() {
      this.rejectDialog = true;
    },
    async acceptReject() {
      this.apolloMutation(RequestProverkaTeh, {
        id: this.editedReq.id,
        type: "Тех возможность отсутствует"
      });
      if (this.editedReq.qualityControlNameList !== undefined) {
        this.qualityControlPokritieList.forEach(qC => {
          this.editedReq.qualityControlNameList.forEach(name => {
            if (qC.name === name) {
              this.editedReq.qualityControlIdList.push(qC.id);
            }
          });
        });
        this.apolloMutation(RequestEdit, {
          idList: [this.editedReq.id],
          param: {
            qualityControlIdList: this.editedReq.qualityControlIdList
          }
        });
      }
      this.rejectDialog = false;
      this.dialog = false;
    },
  },
}