import { RoleRegistration } from '~/apollo/mutation/Role'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      role: {
        name: '',
        comment: ''
      },
    }
  },

  methods: {
    // Метод кнопки сохранения новой Роли
    async saveRole() {
      this.apolloMutation(RoleRegistration, {
        param: {
          name: this.role.name,
          coment: this.role.comment
        }
      })

      this.dialog = false
      this.$refs.form.reset()
    }
  }
}