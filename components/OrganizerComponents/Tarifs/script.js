import { TarifLoadFromBilling, TarifEdit } from '~/apollo/mutation/Tarif'
import { delay } from 'q'
import TarifModel from '~/model/Tarif/TarifModel'

export default {
  mixins: [TarifModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      loader: false,
      titles: [
        { text: '', align: 'center', value: 'checkFlag', sortable: false },
        { text: 'Название', align: 'center', value: 'name' },
        { text: 'Id Биллинга', align: 'center', value: 'billingId' },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Управление тарифами', path: '/tarifs' },
      ],
      tarifs: [],
      tarif: '',
    }
  },

  async mounted() {
    const { data, subscription } = await this.getTarifs()
    this.tarifs = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      this.loader = false
      const idArray = this.tarifs.map(tarif => tarif.id)
      if (!idArray.includes(data.Subscription_Tarif.id)) {
        this.tarifs.push(data.Subscription_Tarif)
      }

      this.tarifs = this.tarifs.map(tarif => {
        if (tarif.id === data.Subscription_Tarif.id) {
          tarif = data.Subscription_Tarif
        }
        return tarif
      })
    })
  },

  methods: {
    filterTarif(value, search, item) {
      return search === Array.prototype.slice.call(item.name, 0, search.length).join('')
        || search === Array.prototype.slice.call(item.billingId, 0, search.length).join('')
    },
    async update() {
      delay(this.loader = true, 5000).then(() => this.loader = false);
      this.apolloMutation(TarifLoadFromBilling)
    },
    async checkFlag(item) {
      this.apolloMutation(TarifEdit, {
        param: {
          flagWatchUser: item.flagWatchUser
        },
        idList: [item.id]
      });
    }
  },
}