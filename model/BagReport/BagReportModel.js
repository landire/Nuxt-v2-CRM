import apollo from '~/mixins/apollo'
import { BagReportSelectFromParam } from '~/apollo/query/BagReport'
import { SubscriptionBagReport } from '~/apollo/subscription/BagReport'

export default {
  mixins: [apollo],
  methods: {
    async getBagReport() {
      const { query, obs } = this.fetchData(
        BagReportSelectFromParam, {
        param: {
          tema: true,
          id: true,
          status: true,
          adminUserId: true,
          prioritet: true,
          userId: true,
        }
      },
        SubscriptionBagReport, {
        param: {
          tema: true,
          id: true,
          status: true,
          adminUserId: true,
          prioritet: true,
          userId: true,
        },
        watch: {
          edited: true
        },
        useridList: [],
        isAll: true,
      })

      const { data } = await query

      return {
        data: data.BagReport_SelectFromParam.res,
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