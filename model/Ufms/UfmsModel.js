import apollo from '~/mixins/apollo'
import { UfmsSelectAll } from '~/apollo/query/Ufms'
import { SubscriptionUfms } from '~/apollo/subscription/Ufms'

export default {
  mixins: [apollo],
  methods: {
    async getUfms() {
      const { query, obs } = this.fetchData(
        UfmsSelectAll, {
        param: {
          id: true,
          name: true,
          structureCod: true
        }
      },
        SubscriptionUfms, {
        param: {
          id: true,
          name: true,
          structureCod: true
        },
        watch: {
          edited: true
        },
        allRequest: true
      })

      const { data } = await query

      return {
        data: data.Ufms_SelectAll.res,
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