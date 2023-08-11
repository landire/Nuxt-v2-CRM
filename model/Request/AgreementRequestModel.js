import apollo from '~/mixins/apollo'
import { RequestSelectDogovor } from '~/apollo/query/Request'
import { SubscriptionRequest } from '~/apollo/subscription/Request'

export default {
  mixins: [apollo],
  methods: {
    async getAgreeRequest() {
      const { query, obs } = this.fetchData(
        RequestSelectDogovor, {
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
          abonAccountId: true,
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
          abonAccountId: true,
        },
        watch: {
          edited: true,
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Request_SelectZakluchDogovor.res,
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