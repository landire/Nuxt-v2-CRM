import apollo from '~/mixins/apollo'
import { RequestSelectFromId } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getRequestFromId(requestId) {
      const { query, obs } = this.fetchData(
        RequestSelectFromId, {
        param: {
          id: null,
          created: null,
          familiya: null,
          name: null,
          otchestvo: null,
          fone: null,
          adres: null,
          status: null,
          ocenka: true,
          qualityControlIdList: true,
          tarifIdList: true,
          abonId: true,
          abonAccountId: true,
        },
        idList: [requestId]
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
          ocenka: true,
          qualityControlIdList: true,
          tarifIdList: true,
          abonId: true,
          abonAccountId: true,
        },
        watch: {
          edited: true
        },
        idList: [requestId]
      })

      const { data } = await query

      return {
        data: data.Request_SelectFromId.res,
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