import apollo from '~/mixins/apollo'
import { RequestSelectNewAbon } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getRequest() {
      const { query, obs } = this.fetchData(
        RequestSelectNewAbon, {
        param: {
          id: null,
          created: null,
          familiya: null,
          name: null,
          otchestvo: null,
          fone: null,
          adres: null,
          status: null,
          qualityControlIdList: true,
        }
      },
        SubscriptionRequest, {
        param: {
          id: null,
          created: null,
          familiya: null,
          name: null,
          otchestvo: null,
          fone: null,
          adres: null,
          status: null,
          qualityControlIdList: true,
        },
        watch: {
          id: null,
          created: null,
          familiya: null,
          name: null,
          otchestvo: null,
          fone: null,
          adres: null,
          status: null,
          qualityControlIdList: true,
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Request_SelectFromNewAbon.res,
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