import QualityRequestModel from '~/model/Request/QualityRequestModel'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'

export default {
  mixins: [TypeQualityModel, QualityRequestModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      titles: [
        { text: "ФИО", align: "center", value: "fio" },
        { text: "Адрес", align: "center", value: "adres" },
        { text: "Телефон", align: "center", value: "fone" },
        { text: "Причины", align: "center", value: "qualityControlNameList" },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Контроль качества", path: "/qualitycontrol" },
      ],
      clients: [],
      qualityControlList: []
    };
  },
  async mounted() {
    const quality = await this.getQualityFromType('Качество')
    this.qualityControlList = quality.data

    const req = await this.getRequestFromQuality(this.qualityControlList.map(qC => qC.id))
    this.clients = req.data
    this.apolloLoading = this.$apollo.loading

    req.subscription((data) => {
      if (data.Subscription_Request.adres !== 'Удален') {
        this.qualityControlList.forEach(qC => {
          const idList = this.clients.map(client => client.id)

          if (data.Subscription_Request.qualityControlIdList.includes(qC.id)) {
            if (!idList.includes(data.Subscription_Request.id)) {
              this.clients.push(data.Subscription_Request)
            } else if (idList.includes(data.Subscription_Request.id)) {
              this.clients = this.clients.map(client => {
                if (data.Subscription_Request.id === client.id) {
                  client = data.Subscription_Request
                }

                return client
              })
            }
          }
        })
      } else if (data.Subscription_Request.adres === 'Удален') {
        this.clients = this.clients.map(client => {
          if (data.Subscription_Request.id === client.id) {
            client = data.Subscription_Request
          }

          return client
        })

        this.clients = this.clients.filter(client => client.id !== data.Subscription_Request.id)
      }
    })
  },
  computed: {
    updatedClients() {
      this.clients = this.clients.map(client => {
        client.fio = `${client.familiya} ${client.name} ${client.otchestvo}`;
        client.qualityControlNameList = [];

        this.qualityControlList.forEach(qC => {
          if (client.qualityControlIdList.includes(qC.id)) {
            client.qualityControlNameList.push(qC.name);
          }
        })

        return client
      })

      return this.clients
    }
  },
}