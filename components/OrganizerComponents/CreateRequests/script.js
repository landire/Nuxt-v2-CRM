import { RequestDelete } from '~/apollo/mutation/Request'
import UserIdRequestModel from '~/model/Request/UserIdRequestModel'

export default {
  mixins: [UserIdRequestModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      reqDeleteDialog: false,
      requests: [],
      apolloLoading: true,
      editedReq: {},
      typeList: ['Нет покрытия', 'Отказ', 'Не устроило', 'Проверка тех возможности'],
      headers: [
        { text: 'Фамилия', align: 'center', value: 'familiya' },
        { text: 'Статус', align: 'center', value: 'statusName' },
        { text: 'Дата', align: 'center', value: 'date' },
        { text: 'Прошло времени', align: 'center', value: 'passedTime' },
        { text: '', align: 'center', value: 'deleteReq', sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Создание заявки', path: '/create' },
      ]
    }
  },

  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        // Корректировка времени (+3 ч)
        const correctDate = new Date(Date.parse(req.created))
        // Парсинг даты
        const time = correctDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        const date = correctDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' })
        req.date = `${date} ${time}`
        const psdTime = (Date.now() / 1000) - (Date.parse(correctDate) / 1000)
        if (Math.round(psdTime) <= 60) {
          req.passedTime = Math.round(psdTime) + ' сек'
        }
        if (Math.round(psdTime) > 60 && Math.round(psdTime) <= 3600) {
          req.passedTime = (Math.round(psdTime / 60)) + ' мин'
        }
        if (Math.round(psdTime) > 3600 && Math.round(psdTime) <= 86400) {
          req.passedTime = (Math.round(psdTime / 3600)) + ' ч'
        }
        if (Math.round(psdTime) > 86400) {
          req.passedTime = (Math.round(psdTime / 86400)) + ' д'
        }

        req.statusName = req.status?.map(stts => ' ' + stts.namestatus)

        return req
      })

      return this.requests
    }
  },

  async mounted() {
    const { data, subscription } = await this.getRequest()
    this.requests = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
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
  },

  methods: {
    async deleteReq(item) {
      if (item.id !== undefined) {
        this.editedReq = item
        this.reqDeleteDialog = true
      }
    },

    async declineDeleteReq() {
      this.editedReq = {}
      this.reqDeleteDialog = false
    },

    async acceptDeleteReq() {
      this.apolloMutation(RequestDelete, {
        idList: [this.editedReq.id]
      })
      this.declineDeleteReq()
    },
  },
}