import apollo from '~/mixins/apollo'
import { AbonErrorSelectAll } from '~/apollo/query/AbonError'
import { SubscriptionAbonError } from '~/apollo/subscription/Abon'

export default {
  mixins: [apollo],
  methods: {
    async getAbonError() {
      const { query, obs } = this.fetchData(
        AbonErrorSelectAll, {
        param: {
          id: true,
          billingAbonId: true,
          abonErrors: true,
          coment: true,
          full_name: true,
          auswais: true
        }
      },
        SubscriptionAbonError, {
        isAll: true,
      })

      const { data } = await query

      return {
        data: data.AbonError_SelectAll.res,
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