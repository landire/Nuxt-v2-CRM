import apollo from '~/mixins/apollo'
import { TarifSelect } from '~/apollo/query/Tarif'
import { SubscriptionTarif } from '~/apollo/subscription/Tarif'

export default {
  mixins: [apollo],
  methods: {
    async getTarifs() {
      const { query, obs } = this.fetchData(
        TarifSelect, {
        param: {
          name: true,
          id: true,
          billingId: true,
          billingFind: true,
          flagWatchUser: true
        }
      },
        SubscriptionTarif, {
        param: {
          name: true,
          id: true,
          billingId: true,
          billingFind: true,
          flagWatchUser: true
        },
        watch: {
          edited: true
        }
      })

      const { data } = await query

      return {
        data: data.Tarif_SelectAll.res,
        subscription(callback) {
          obs.subscribe({
            next({ data }) {
              callback(data)
            }
          })
        }
      }
    }
  }
}