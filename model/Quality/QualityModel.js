import apollo from '~/mixins/apollo'
import { QualityControlSelectAll } from '~/apollo/query/QualityControl'
import { SubscriptionQualityControl } from '~/apollo/subscription/QualityControl'

export default {
  mixins: [apollo],
  methods: {
    async getQuality() {
      const { query, obs } = this.fetchData(
        QualityControlSelectAll, {
        param: {
          id: true,
          name: true,
          status: true,
          type: true,
        }
      },
        SubscriptionQualityControl, {
        param: {
          name: true,
          type: true,
          status: true,
          id: true
        },
        watch: {
          edited: true,
        },
        allQualityControl: true
      })

      const { data } = await query

      return {
        data: data.QualityControl_SelectAll.res,
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