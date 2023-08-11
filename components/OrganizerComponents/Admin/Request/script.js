import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import IdRequestModel from '~/model/Request/IdRequestModel'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'

export default {
  mixins: [IdRequestModel, RequestTarifModel],
  components: { RoutePanel },
  data() {
    return {
      request: [],
      tarifs: [],
      tarifsName: [],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Кабинет администратора", path: "/admin" },
        { name: "Заявки", path: "/admin/requests" },
        { name: "Заявка", path: this.$route.path },
      ],
    };
  },
  async mounted() {
    const request = await this.getRequestFromId(this.$route.params.id)
    this.request = request.data

    request.subscription((data) => {
      this.request = this.request.map(req => {
        req = data.Subscription_Request

        return req
      })
    })

    const tarifs = await this.getReqTarifs()
    this.tarifs = tarifs.data
    this.tarifsName = tarifs.data.map(tarif => tarif.name)

    tarifs.subscription((data) => {
      const idList = this.tarifs.map(tarif => tarif.id)

      if (!idList.includes(data.Subscription_Tarif.id)) {
        this.tarifs.push(data.Subscription_Tarif)
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

  computed: {
    compRequest() {
      this.request = this.request.map(req => {
        req.tarifNameList = [];
        req.tarifIdList?.forEach(id => {
          this.tarifs.forEach(tarif => {
            if (id === tarif.id) {
              req.tarifNameList.push(tarif.name);
            }
          })
        })

        const statusNameList = req.status.map(stts => stts.namestatus);
        req.statusNames = statusNameList.join(", ");

        const correctDate = new Date(Date.parse(req.created) + 600000);
        const time = correctDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        const date = correctDate.toLocaleDateString("ru-RU", { year: "numeric", month: "numeric", day: "numeric" });
        req.date = `${date} ${time}`;

        return req
      })


      return this.request
    }
  }
}