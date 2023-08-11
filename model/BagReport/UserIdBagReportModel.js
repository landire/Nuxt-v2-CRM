import apollo from '~/mixins/apollo'
import { BagReportSelectFromUserId } from '~/apollo/query/BagReport'
import { SubscriptionBagReport } from '~/apollo/subscription/BagReport'

export default {
  mixins: [apollo],
  methods: {
    async getBagReportFromUserId(userId = []) {
      const { query, obs } = this.fetchData(
        BagReportSelectFromUserId, {
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
        data: data.BagReport_SelectFromUserId.res,
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