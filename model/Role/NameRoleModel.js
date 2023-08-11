import apollo from '~/mixins/apollo'
import { RoleSelectName } from '~/apollo/query/Role'

export default {
  mixins: [apollo],
  methods: {
    async getRoleFromName(name = '') {
      const { query } = this.fetchData(
        RoleSelectName, {
        param: {
          id: null,
        },
        nameList: name
      })

      const { data } = await query

      return {
        data: data.Role_SelectFromName.res,
      }
    }
  }
}