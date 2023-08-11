import apollo from '~/mixins/apollo'
import { RequestSelectFromAdmin } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getRequest() {
      const { query, obs } = this.fetchData(
        RequestSelectFromAdmin, {
        param: {
          id: true,
          familiya: true,
          name: true,
          otchestvo: true,
          created: true,
          adres: true,
        }
      },
        SubscriptionRequest, {
        param: {
          id: true,
          familiya: true,
          name: true,
          otchestvo: true,
          created: true,
          adres: true,
        },
        watch: {
          edited: true
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Request_SelectFromAdmin.res,
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