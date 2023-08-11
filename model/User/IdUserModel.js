import apollo from '~/mixins/apollo'
import { UserSelectId } from '~/apollo/query/User'
import { SubscriptionUser } from '~/apollo/subscription/User'

export default {
  mixins: [apollo],
  methods: {
    async getUsers(userId) {
      const { query, obs } = this.fetchData(
        UserSelectId, {
        param: {
          name: true,
          id: true,
          idTelegram: true
        },
        userIdList: [userId]
      },
        SubscriptionUser, {
        param: {
          name: null,
          id: null,
          idTelegram: true
        },
        watch: {
          edited: true
        },
        idList: [userId],
      })

      const { data } = await query

      return {
        data: data.User_SelectFromUserId.res,
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