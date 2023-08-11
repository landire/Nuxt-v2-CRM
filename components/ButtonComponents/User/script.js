import { UserRegistration } from '~/apollo/mutation/User'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      user: {
        name: '',
        email: '',
        password: ''
      },
    }
  },

  methods: {

    // Метод кнопки сохранения нового Юзера
    async saveUser() {
      this.apolloMutation(UserRegistration, {
        param: {
          password: this.user.password,
          email: this.user.email,
          name: this.user.name
        }
      })

      this.dialog = false
      this.$refs.form.reset()
    }
  }
}