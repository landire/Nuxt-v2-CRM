import apollo from '~/mixins/apollo'
import { TarifSelectFromRequest } from '~/apollo/query/Tarif'
import { SubscriptionTarif } from '~/apollo/subscription/Tarif'

export default {
  mixins: [apollo],
  methods: {
    async getReqTarifs() {
      const { query, obs } = this.fetchData(
        TarifSelectFromRequest, {
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
        data: data.Tarif_SelectFromRequest.res,
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