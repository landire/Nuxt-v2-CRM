import apollo from '~/mixins/apollo'
import { TelegramGroopSelectFromId } from '~/apollo/query/TelegramGroup'
import { SubscriptionTelegramGroop } from '~/apollo/subscription/TelegramGroup'

export default {
  mixins: [apollo],
  methods: {
    async getTelegramGroupFromId(telegramId) {
      const { query, obs } = this.fetchData(
        TelegramGroopSelectFromId, {
        param: {
          name: true,
          coment: true,
          userIdList: true,
        },
        idList: [telegramId]
      },
        SubscriptionTelegramGroop, {
        param: {
          name: true,
          coment: true,
          userIdList: true,
        },
        watch: {
          edited: true
        },
        idList: [telegramId],
      })

      const { data } = await query

      return {
        data: data.TelegramGroop_SelectFromId.res,
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