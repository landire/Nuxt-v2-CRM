import { UfmsCreate } from '~/apollo/mutation/Ufms'
import { UfmsSelectFromCode } from '~/apollo/query/Ufms'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      ufms: {
        name: '',
        structureCod: ''
      },
    }
  },

  methods: {
    // Метод кнопки сохранения новой Роли
    async saveUfms() {
      this.apolloMutation(UfmsCreate, {
        param: {
          name: this.ufms.name,
          structureCod: this.ufms.structureCod
        }
      })

      this.dialog = false
      this.$refs.form.reset()
    },

    async getUfmsName() {
      if (this.ufms.structureCod?.length === 7) {
        console.log(this.ufms.structureCod)
        this.apolloQuery(UfmsSelectFromCode, {
          param: {
            name: true
          },
          structureCodList: [this.ufms.structureCod]
        }).then(({ data }) => {
          this.ufms.name = data.Ufms_SelectFromCode.res.map(ufms => ufms.name)
        })
      }
    }
  }
}