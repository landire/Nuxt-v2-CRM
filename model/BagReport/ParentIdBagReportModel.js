import apollo from '~/mixins/apollo'
import { BagReportSelectFromParentId } from '~/apollo/query/BagReport'
import { SubscriptionBagReport } from '~/apollo/subscription/BagReport'

export default {
  mixins: [apollo],
  methods: {
    async getBagReportFromParentId(bagReportId = []) {
      const { query, obs } = this.fetchData(
        BagReportSelectFromParentId, {
        param: {
          tema: true,
          status: true,
          adminUserId: true,
          id: true,
        },
        idList: bagReportId
      },
        SubscriptionBagReport, {
        param: {
          tema: true,
          status: true,
          adminUserId: true,
          id: true,
        },
        watch: {
          edited: true
        },
        parentBagreportIdList: bagReportId
      })

      const { data } = await query

      return {
        data: data.BagReport_SelectFromParentId.res,
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