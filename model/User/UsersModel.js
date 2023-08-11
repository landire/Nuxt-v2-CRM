import apollo from '~/mixins/apollo'
import { UserSelectFromAdmin } from '~/apollo/query/User'
import { SubscriptionUser } from '~/apollo/subscription/User'

export default {
  mixins: [apollo],
  methods: {
    async getUsers(isSubscribe = true) {
      const { query, obs } = this.fetchData(
        UserSelectFromAdmin, {
        param: {
          name: null,
          id: null,
          idTelegram: true
        }
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
        idList: [],
        allUsers: true
      })

      const { data } = await query

      return {
        data: data.User_SelectFromAdmin.res,
        subscription: isSubscribe? (callback) => {
          obs.subscribe({
            next({ data }) {
              callback(data)
            }
          })
        } : null
      }
    }
  }
}