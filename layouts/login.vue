<template>
  <v-app class="app-light">
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import JWTModel from '~/model/JWT/JWTModel'

export default {
  mixins: [JWTModel],
  head: {
    title: 'Real Web - Вход',
  },

  async mounted() {
    const { subscription } = await this.getJWT()
    subscription((data) => {
      this.$store.dispatch('tokenSubscription', data.Subscription_JWT.token)
    })
  }
}
</script>