import apollo from '~/mixins/apollo'
import { BagReportSelectFromId } from '~/apollo/query/BagReport'
import { SubscriptionBagReport } from '~/apollo/subscription/BagReport'

export default {
  mixins: [apollo],
  methods: {
    async getBagReportFromId(bagReportId = [], subscribe = true) {
      const { query, obs } = this.fetchData(
        BagReportSelectFromId, {
        param: {
          text: true,
          tema: true,
          img: true,
          status: true,
          adminUserId: true,
          id: true,
          parentBagreportId: true,
          userId: true,
          prioritet: true,
        },
        idList: bagReportId
      },
        SubscriptionBagReport, {
        param: {
          text: true,
          tema: true,
          img: true,
          status: true,
          adminUserId: true,
          id: true,
          parentBagreportId: true,
          userId: true,
          prioritet: true,
        },
        watch: {
          edited: true
        },
        idList: bagReportId
      })

      const { data } = await query

      return {
        data: data.BagReport_SelectFromId.res,
        subscription: subscribe? (callback) => {
          obs.subscribe({
            next({ data }) {
              callback(data)
            }
          })
        } : null
      }
    }
  }
}