import apollo from '~/mixins/apollo'
import { RequestSelectFromQuality } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getRequestFromQuality(qualityId = []) {
      const { query, obs } = this.fetchData(
        RequestSelectFromQuality, {
        param: {
          id: true,
          familiya: true,
          name: true,
          otchestvo: true,
          fone: true,
          adres: true,
          qualityControlIdList: true,
          adresBilling: true,
        },
        qualityControlIdList: qualityId
      },
        SubscriptionRequest, {
        param: {
          id: true,
          familiya: true,
          name: true,
          otchestvo: true,
          fone: true,
          adres: true,
          qualityControlIdList: true,
          adresBilling: true,
        },
        watch: {
          edited: true
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Request_SelectFromQuality.res,
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