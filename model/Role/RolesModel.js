import apollo from '~/mixins/apollo'
import { RoleSelectAdmin } from '~/apollo/query/Role'
import { SubscriptionRole } from '~/apollo/subscription/Role'

export default {
  mixins: [apollo],
  methods: {
    async getRole() {
      const { query, obs } = this.fetchData(
        RoleSelectAdmin, {
        param: {
          name: null,
          coment: null,
          id: null,
          isPermission: null
        }
      },
        SubscriptionRole, {
        param: {
          name: null,
          coment: null,
          id: null,
          isPermission: null
        },
        watch: {
          edited: true
        },
        idList: [],
        allRoles: true
      })

      const { data } = await query

      return {
        data: data.Role_SelectFromAdmin.res,
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