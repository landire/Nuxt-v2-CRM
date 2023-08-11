import { BagReportCreate } from '~/apollo/mutation/BagReport'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      report: {
        title: '',
        content: '',
        image: undefined
      },
      blobImage: undefined
    }
  },

  methods: {
    async selectImage(image) {
      if (image !== null && image !== undefined) {
        this.report.image = URL.createObjectURL(image)
        this.blobImage = image
      } else {
        this.report.image = undefined
        this.blobImage = undefined
      }
    },

    async imageToBase64(blob, callback) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        callback(reader.result)
      }
    },

    async send() {
      if (this.blobImage !== undefined && this.blobImage !== null) {
        this.imageToBase64(this.blobImage, (data) => {
          this.apolloMutation(BagReportCreate, {
            tema: this.report.title,
            text: this.report.content,
            img: data,
            parentBagreportId: this.$route.params.id
          }).then(() => this.$refs.form.reset())
        })
      } else {
        this.apolloMutation(BagReportCreate, {
          tema: this.report.title,
          text: this.report.content,
          parentBagreportId: this.$route.params.id
        }).then(() => this.$refs.form.reset())
      }
    },
  }
}