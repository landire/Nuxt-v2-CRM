import apollo from '~/mixins/apollo'
import { DistrictsSelectFromId } from '~/apollo/query/Districts'
import { SubscriptionDistricts } from '~/apollo/subscription/Districts'

export default {
  mixins: [apollo],
  methods: {
    async getDistrictFromId(districtId) {
      const { query, obs } = this.fetchData(
        DistrictsSelectFromId, {
        param: {
          name: true,
          housesList: true,
        },
        idList: [districtId]
      },
        SubscriptionDistricts, {
        isAll: true,
      })

      const { data } = await query

      return {
        data: data.Districts_SelectFromId.res,
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