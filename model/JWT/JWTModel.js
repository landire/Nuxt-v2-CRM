import apollo from '~/mixins/apollo'
import { SubscriptionJWT } from '~/apollo/subscription/JWT'

export default {
  mixins: [apollo],
  methods: {
    async getJWT() {
      const { obs } = this.fetchData(
        undefined,
        undefined,
        SubscriptionJWT, {
        watch: {
          token: true,
          edited: true
        },
        param: {
          token: true
        },
      })

      return {
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