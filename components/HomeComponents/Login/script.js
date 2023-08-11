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