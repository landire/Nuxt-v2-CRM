import apollo from '~/mixins/apollo'
import { UserRoleSelectUserId } from '~/apollo/query/UserRole'
import { SubscriptionUserRole } from '~/apollo/subscription/UserRole'


export default {
  mixins: [apollo],
  methods: {
    async getUserRole(userId = []) {
      const { query, obs } = this.fetchData(
        UserRoleSelectUserId, {
        param: {
          id: true,
          RoleList: [],
          userId: true,
          name: true
        },
        userIdList: userId
      },
        SubscriptionUserRole, {
        watch: {
          edited: true
        },
        param: {
          id: true,
          RoleList: true,
          userId: true,
          name: true
        },
        idList: [],
        useridList: userId
      })

      const { data } = await query

      return {
        data: data.UserRole_SelectFromUserId.res,
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