import { DistrictsCreate } from '~/apollo/mutation/Districts'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      name: '',
    }
  },

  methods: {
    async saveDistrict() {
      this.apolloMutation(DistrictsCreate, {
        param: {
          name: this.name
        }
      })

      this.$refs.form.reset()
      this.dialog = false
    }
  }
}