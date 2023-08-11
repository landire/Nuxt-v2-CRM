import apollo from '~/mixins/apollo'
import download from '~/mixins/download'
import { GetReestrPayments, GetReestrPaymentsFile } from '~/apollo/query/ReestrPayments'

export default {
  mixins: [apollo, download],
  data() {
    return {
      dialog: false,
      dialogLoader: false,
      loadingSuccess: undefined,
      show: false,
      payment: {
        year: '',
        month: '',
        day: '',
        npp: '',
        inn: '',
        kassir: '',
        apiKey: ''
      },
      fileName: '',
      fileData: undefined,
      monthList: []
    }
  },

  mounted() {
    for (let i = 0; i < 12; i++) {
      this.monthList[i] = i + 1
    }
  },

  methods: {
    getFile() {
      this.apolloQuery(GetReestrPayments, {
        Year: Number(`20${this.payment.year}`),
        Month: Number(this.payment.month),
        Day: Number(this.payment.day),
        npp: Number(this.payment.npp),
        inn: this.payment.inn,
        kassir: this.payment.kassir,
        apiKey: this.payment.apiKey
      }).then(({ data }) => {
        this.fileName = data.GetReestrPayments.res.FileName
        this.dialogLoader = true
      })

      setTimeout(() => {
        this.apolloQuery(GetReestrPaymentsFile, {
          FileName: this.fileName
        }).then((res) => {
          this.fileData = res.data.GetReestrPaymentsFile

          if (this.fileData !== undefined) {
            this.download(this.fileData, this.fileName)
            this.loadingSuccess = true
            setTimeout(() => {
              this.dialogLoader = false
              this.loadingSuccess = undefined
            }, 1000)
          }
        }).catch(err => {
          if (err) {
            this.loadingSuccess = false
            setTimeout(() => {
              this.dialogLoader = false
              this.loadingSuccess = undefined
            }, 1000)
          }
        })

        setTimeout(() => {
          this.dialog = false
          this.$refs.form.reset()
        }, 1000)
      }, 5000)
    }
  }
}