import apollo from '~/mixins/apollo'
import { TelegramGroopSelectFromAdmin } from '~/apollo/query/TelegramGroup'
import { SubscriptionTelegramGroop } from '~/apollo/subscription/TelegramGroup'

export default {
  mixins: [apollo],
  methods: {
    async getTelegramGroup() {
      const { query, obs } = this.fetchData(
        TelegramGroopSelectFromAdmin, {
        param: {
          id: true,
          name: true,
          coment: true
        }
      },
        SubscriptionTelegramGroop, {
        param: {
          id: true,
          name: true,
          coment: true
        },
        watch: {
          edited: true
        },
        idList: [],
        isAll: true,
      })

      const { data } = await query

      return {
        data: data.TelegramGroop_SelectFromAdmin.res,
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