import apollo from '~/mixins/apollo'
import { RequestSelectTexAccept } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getTechRequest() {
      const { query, obs } = this.fetchData(
        RequestSelectTexAccept, {
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
        allRequest: true,
      })

      const { data } = await query

      return {
        data: data.Request_SelectFromTexAccept.res,
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