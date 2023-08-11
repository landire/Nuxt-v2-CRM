import { RequestEdit } from '~/apollo/mutation/Request'
import { DistrictsSelectAll } from '~/apollo/query/Districts'
import TypeQualityModel from '~/model/Quality/TypeQualityModel'
import QualityRequestModel from '~/model/Request/QualityRequestModel'

export default {
  mixins: [TypeQualityModel, QualityRequestModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      billingAdresDialog: false,
      titles: [
        { text: "ФИО", align: "center", value: "fio" },
        { text: "Адрес заявки", align: "center", value: "adres" },
        { text: "Адрес биллинга", align: "center", value: "adresBilling" },
        { text: "Телефон", align: "center", value: "fone" },
        { text: "Причины", align: "center", value: "qualityControlNameList" },
        { text: "", align: "center", value: "addBillingAdres", sortable: false },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Отсутствует покрытие", path: "/coverage" },
      ],
      clients: [],
      editedClient: {},
      district: undefined,
      districtName: "",
      districts: [],
      qualityControlList: [],
      allHousesNames: [],
      allHouses: [],
    };
  },
  async mounted() {
    const quality = await this.getQualityFromType('Покрытие')
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
        });
        return client;
      });
      return this.clients;
    }
  },
  methods: {
    async addAdres() {
      this.apolloMutation(RequestEdit, {
        param: {
          adresBilling: this.editedClient.adresBilling
        },
        idList: [this.editedClient.id]
      });
      this.billingAdresDialog = false;
    },
    async addAdresDialog(item) {
      this.apolloQuery(DistrictsSelectAll, {
        param: {
          id: true,
          name: true,
          housesList: true
        }
      }).then(data => {
        this.editedClient = item;
        this.editedClient.districts = data.data.Districts_SelectAll.res;
        this.editedClient.districtsNames = data.data.Districts_SelectAll.res.map(dist => dist.name);
      });
      this.billingAdresDialog = true;
    },
    async selectDist() {
      this.editedClient.districts.forEach(dist => {
        if (dist.name === this.editedClient.districtName) {
          this.editedClient.district = dist;
        }
      });
    }
  },
}