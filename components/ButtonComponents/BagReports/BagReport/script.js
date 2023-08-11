import { BagReportCreate } from '~/apollo/mutation/BagReport'
import apollo from '~/mixins/apollo'

export default {
  mixins: [apollo],
  data() {
    return {
      dialog: false,
      title: '',
      content: '',
      image: undefined,
      blobImage: undefined,
      imageBase64: '',
    }
  },

  methods: {
    async selectImage(image) {
      if (image !== null && image !== undefined) {
        this.image = URL.createObjectURL(image)
        this.blobImage = image
      } else {
        this.image = undefined
        this.blobImage = undefined
      }
    },

    async send() {
      if (this.blobImage !== undefined && this.blobImage !== null) {
        this.imageToBase64(this.blobImage, (data) => {
          this.apolloMutation(BagReportCreate, {
            tema: this.title,
            text: this.content,
            img: data
          }).then(() => {
            this.$refs.form.reset()
          })

          this.dialog = false
        })
      } else {
        this.apolloMutation(BagReportCreate, {
          tema: this.title,
          text: this.content
        }).then(() => {
          this.$refs.form.reset()
        })

        this.dialog = false
      }
    },

    async imageToBase64(blob, callback) {
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        callback(reader.result)
      }
    },
  }
}