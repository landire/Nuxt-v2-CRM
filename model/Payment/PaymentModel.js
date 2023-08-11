import apollo from '~/mixins/apollo'
import { PayReportSelectAll } from '~/apollo/query/Report'
import { SubscriptionPayReport } from '~/apollo/subscription/Report'

export default {
  mixins: [apollo],
  methods: {
    async getPayment() {
      const { query, obs } = this.fetchData(
        PayReportSelectAll, {
        param: {
          amount: true,
          count: true,
          year: true,
          month: true,
          notDistricts: true,
          districts: true,
          id: true,
        }
      },
        SubscriptionPayReport)

      const { data } = await query

      return {
        data: data.PayReport_SelectAll.res,
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