import apollo from '~/mixins/apollo'
import { BagReportSelectFromAdminUserId } from '~/apollo/query/BagReport'
import { SubscriptionBagReport } from '~/apollo/subscription/BagReport'

export default {
  mixins: [apollo],
  methods: {
    async getBagReportFromAdminUserId(userId = []) {
      const { query, obs } = this.fetchData(
        BagReportSelectFromAdminUserId, {
        param: {
          tema: true,
          text: true,
          status: true,
          id: true
        },
        userIdList: userId
      },
        SubscriptionBagReport, {
        param: {
          tema: true,
          text: true,
          status: true,
          id: true
        },
        watch: {
          edited: true
        },
        useridList: userId,
      })

      const { data } = await query

      return {
        data: data.BagReport_SelectFromAdminUserId.res,
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