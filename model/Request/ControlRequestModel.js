import apollo from '~/mixins/apollo'
import { RequestSelectKontrol } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getControlRequest() {
      const { query, obs } = this.fetchData(
        RequestSelectKontrol, {
        param: {
          id: null,
          created: null,
          familiya: null,
          name: null,
          otchestvo: null,
          fone: null,
          adres: null,
          status: null,
          tarifIdList: true,
          abonId: true,
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
          tarifIdList: true,
          abonId: true,
          qualityControlIdList: true,
        },
        watch: {
          edited: true
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Request_SelectKontrol.res,
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