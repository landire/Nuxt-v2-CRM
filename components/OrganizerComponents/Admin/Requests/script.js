import RequestModel from '~/model/Request/RequestModel'

export default {
  mixins: [RequestModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      reqTitles: [
        { text: "ФИО", align: "center", value: "fio" },
        { text: "Дата создания", align: "center", value: "date" },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Кабинет администратора', path: '/admin' },
        { name: 'Заявки', path: '/admin/requests' },
      ],
      requests: [],
    };
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
  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        req.fio = `${req.familiya} ${req.name} ${req.otchestvo}`

        const correctDate = new Date(Date.parse(req.created) + 600000);
        const time = correctDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        const date = correctDate.toLocaleDateString("ru-RU", { year: "numeric", month: "numeric", day: "numeric" });
        req.date = `${date} ${time}`;

        return req;
      })

      return this.requests;
    }
  },
}