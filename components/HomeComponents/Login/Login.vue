<template>
  <div class="container">

    <v-container class="login-form justify-center">
      <div class="text-center mb-3">
        <span class="text-h5">Вход</span>
      </div>
      <v-form class="d-flex justify-center flex-column" @submit.prevent>
        <v-container>
          <v-text-field :error-messages="errorEmail" label="Почта" outlined type="email" name="email" v-model="email"
            required />
          <v-text-field :error-messages="errorPass" label="Пароль" outlined :type="show ? 'text' : 'password'"
            name="password" v-model="password" required :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show" />
          <div class="text-center">
            <v-btn width="100px" class="primary darken-1" type="submit" @click="getData">Войти</v-btn>
          </div>
        </v-container>
      </v-form>
    </v-container>
    <span class="logo"></span>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  height: 40%;
  max-width: 30%;
  border: 0.1mm solid;
  border-color: $rounded-container-border-light;
  border-radius: 5px;
  background-color: $rounded-container-light;
  display: flex;
  flex-direction: column;
}
</style>

<script>
import { UserLogin } from '~/apollo/query/User'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      email: '',
      password: '',
      show: false,
      errorPass: null,
      errorEmail: null,
    }
  },
  methods: {

    // Метод отправки данных во Vuex хранилище 
    async getData() {
      await this.$store.dispatch('login', { email: this.email, password: this.password })

      this.apolloQuery(UserLogin, {
        email: this.email,
        password: this.password
      }).then(({ data }) => {

        if (data.User_LoginEmail.err !== null) {
          if (data.User_LoginEmail.err.length > 35) {
            this.errorEmail = data.User_LoginEmail.err
            this.errorPass = null
          } else {
            this.errorPass = data.User_LoginEmail.err
            this.errorEmail = null
          }
        } else {
          this.errorEmail = data.User_LoginEmail.err
          this.errorPass = data.User_LoginEmail.err
        }
      })

      this.$router.push('/')
    }
  }
}
</script>