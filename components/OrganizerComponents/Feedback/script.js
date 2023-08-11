import { RequestStatus, RequestEdit } from '~/apollo/mutation/Request'
import FeedbackRequestModel from '~/model/Request/FeedbackRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'
import QualityModel from '~/model/Quality/QualityModel'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'

export default {
  mixins: [FeedbackRequestModel, RequestTarifModel, QualityModel, TypeQualityModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: "",
      dialog: false,
      editDialog: false,
      requests: [],
      editedReq: {},
      apolloLoading: true,
      tarifs: [],
      tarifsName: [],
      titles: [
        { text: "ФИО", align: "center", value: "fio" },
        { text: "Адрес", align: "center", value: "adres" },
        { text: "Дата", align: "center", value: "date" },
        { text: "Телефон", align: "center", value: "fone" },
        { text: "", align: "center", value: "editReq", sortable: false },
        { text: "", align: "center", value: "callReq", sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Обратная связь', path: '/feedback' },
      ],
      typeList: ["Нет покрытия", "Отказ", "Проверка тех возможности"],
      qualityControlList: [],
      qualityControlPokritieListName: [],
      qualityControlOtkazListName: [],
      isPokritie: false,
      isOtkaz: false,
    };
  },

  computed: {
    updateReq() {
      this.requests = this.requests.map(req => {
        req.fio = `${req.familiya} ${req.name} ${req.otchestvo}`;
        const statusList = req.status.map(stts => stts.namestatus);
        if (statusList.includes("Проверка тех возможности")) {
          req.isTexStatus = true;
        }
        req.qualityControlNameList = [];
        req.qualityControlIdList?.forEach(id => {
          this.qualityControlList.forEach(qC => {
            if (qC.id === id) {
              req.qualityControlNameList.push(qC.name);
            }
          })
        })

        const correctDate = new Date(Date.parse(req.created))

        const time = correctDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        const date = correctDate.toLocaleDateString("ru-RU", { year: "numeric", month: "numeric", day: "numeric" });
        req.date = `${date} ${time}`;
        return req
      })

      this.tarifsName = this.tarifs.map(tarif => tarif.name);

      return this.requests
    },
  },

  async mounted() {
    const req = await this.getRequest()
    this.requests = req.data
    this.apolloLoading = this.$apollo.loading

    req.subscription((data) => {
      if (data.Subscription_Request.adres !== 'Удален') {
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
          const statusList = req.status.map(stts => stts.namestatus)
          if (!statusList.includes('Нет покрытия')
            && !statusList.includes('Отказ')
            && !statusList.includes('Не устроило')
            && !statusList.includes('Проверка тех возможности')) {
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

    tarifs.subscription((data) => {
      if (data.Subscription_Tarif.flagWatchUser === true) {
        this.tarifs.push(data.Subscription_Tarif)
      }
      
      if (data.Subscription_Tarif.flagWatchUser === false) {
        this.tarifs = this.tarifs.filter(tarif => {
          if (tarif.id !== data.Subscription_Tarif.id) {
            return tarif
          }
        })
      }
    })

    const coverageQuality = await this.getQualityFromType('Покрытие')
    this.qualityControlPokritieListName = coverageQuality.data.map(qControl => qControl.name)


    const rejectQuality = await this.getQualityFromType('Отказ')
    this.qualityControlOtkazListName = rejectQuality.data.map(qControl => qControl.name)

    const allQuality = await this.getQuality()
    this.qualityControlList = allQuality.data
  },

  methods: {
    async selectType(type) {
      if (type === "Нет покрытия") {
        this.isPokritie = true;
        this.isOtkaz = false;
        this.editedReq.qualityControlNameList = [];
      }
      else if (type === "Отказ") {
        this.isOtkaz = true;
        this.isPokritie = false;
        this.editedReq.qualityControlNameList = [];
      }
      else {
        this.isOtkaz = false;
        this.isPokritie = false;
        this.editedReq.qualityControlNameList = [];
      }
    },
    async saveReq() {
      this.apolloMutation(RequestEdit, {
        param: {
          familiya: this.editedReq.familiya,
          name: this.editedReq.name,
          otchestvo: this.editedReq.otchestvo,
          adres: this.editedReq.adres,
          fone: this.editedReq.fone
        },
        idList: [this.editedReq.id]
      });
      this.editDialog = false;
    },
    async editReq(item) {
      this.editedReq = item;
      this.editDialog = true;
    },
    async callReq(item) {
      this.editedReq = item;
      this.editedReq.type = "";
      this.dialog = true;
    },
    async accept() {
      if (this.editedReq.qualityControlNameList !== undefined) {
        this.qualityControlList.forEach(qC => {
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
      this.apolloMutation(RequestStatus, {
        id: this.editedReq.id,
        type: this.editedReq.type
      });
      if (this.editedReq.tarif !== undefined) {
        let tarifIdList = [];
        this.tarifs.forEach(tarif => {
          if (this.editedReq.tarif.includes(tarif.name)) {
            tarifIdList.push(tarif.id);
          }
        });
        this.apolloMutation(RequestEdit, {
          idList: [this.editedReq.id],
          param: {
            tarifIdList: tarifIdList
          }
        });
      }
      this.dialog = false;
    },
  },
}