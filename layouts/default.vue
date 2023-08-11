<template>
  <v-app class="app-light">
    <v-app-bar class="app-bar--options" app dark rounded>
      <div class="toolbar-container">
        <span class="username">{{ username.name }}</span>
        <Logout />
      </div>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<style>
.toolbar-container {
  display: flex;
  min-width: 100%;
  align-items: center;
  justify-content: end;
}

.username {
  margin-right: 10px;
  color: white;
  font-weight: bold;
  cursor: default;
}
</style>

<script>
import Logout from '~/components/ButtonComponents/Logout.vue'
import IdUserModel from '~/model/User/IdUserModel'
import JWTModel from '~/model/JWT/JWTModel'

export default {
  components: { Logout },
  mixins: [JWTModel, IdUserModel],
  data() {
    return {
      username: '',
    }
  },

  async mounted() {
    const { data } = await this.getUsers(this.$store.state.decodedToken.id)
    this.username = data.find(user => user.name)

    const { subscription } = await this.getJWT()
    subscription((data) => {
      this.$store.dispatch('tokenSubscription', data.Subscription_JWT.token)
    })
  },
}
</script>
