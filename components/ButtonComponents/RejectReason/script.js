import { QualityControlCreate } from '~/apollo/mutation/QualityControl'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      quality: {
        name: '',
        type: '',
      },
      typeList: ['Качество', 'Покрытие', 'Отказ'],
    }
  },

  methods: {
    async saveQControl() {
      this.apolloMutation(QualityControlCreate, {
        param: {
          name: this.quality.name,
          type: this.quality.type
        }
      })
      this.dialog = false
      this.$refs.form.reset()
    }
  }
}