import apollo from '~/mixins/apollo'
import { DistrictsSelectAll } from '~/apollo/query/Districts'
import { SubscriptionDistricts } from '~/apollo/subscription/Districts'

export default {
  mixins: [apollo],
  methods: {
    async getDistricts() {
      const { query, obs } = this.fetchData(
        DistrictsSelectAll, {
        param: {
          id: true,
          name: true,
        }
      },
        SubscriptionDistricts, {
        isAll: true,
      })

      const { data } = await query

      return {
        data: data.Districts_SelectAll.res,
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