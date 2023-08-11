import apollo from '~/mixins/apollo'
import { RequestSelectPodkluchenie } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getConnectRequest() {
      const { query, obs } = this.fetchData(
        RequestSelectPodkluchenie, {
        param: {
          id: null,
          created: null,
          familiya: null,
          name: null,
          otchestvo: null,
          fone: null,
          adres: null,
          status: null,
          tarifIdList: null,
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
          tarifIdList: null,
        },
        watch: {
          edited: true
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Request_SelectPodkluchenie.res,
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