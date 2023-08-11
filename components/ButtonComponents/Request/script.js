import { delay } from 'q'
import { RequestCreate, RequestStatus } from '~/apollo/mutation/Request'
import RequestTarifModel from '~/model/Tarif/RequestTarifModel'

export default {
  mixins: [RequestTarifModel],
  data() {
    return {
      request: {
        familiya: '',
        name: null,
        otchestvo: '',
        adres: '',
        fone: '',
        tarifsNameList: [],
        tarifsIdList: [],
      },
      dialog: false,
      tarifs: [],
      tarifsName: [],
    }
  },

  async mounted() {
    const { data, subscription } = await this.getReqTarifs()
    this.tarifs = data
    this.tarifsName = data.map(tarif => tarif.name)

    subscription((data) => {
      if (data.Subscription_Tarif.flagWatchUser === true) {
        this.tarifs.push(data.Subscription_Tarif)
      }

      if (data.Subscription_Tarif.flagWatchUser === false) {
        this.tarifs = this.tarifs.filter(tarif => {
          if (tarif.id !== data.Subscription_Tarif.id) {
            return tarif
          }
        })
      }

      this.tarifsName = this.tarifs.map(tarif => tarif.name)
    })
  },


  methods: {
    // Метод кнопки сохранения нового Абонента
    async saveReq() {
      if (this.request.name !== null) {
        this.tarifs.forEach(tarif => {
          if (this.request.tarifsNameList.includes(tarif.name)) {
            this.request.tarifsIdList.push(tarif.id)
          }
        })

        this.apolloMutation(RequestCreate, {
          param: {
            familiya: this.request.familiya,
            name: this.request.name,
            otchestvo: this.request.otchestvo,
            adres: this.request.adres,
            fone: this.request.fone,
            tarifIdList: this.request.tarifsIdList,
          }
        }).then(({ data }) => {
          if (this.request.tarifsIdList.length > 0) {
            delay(1000).then(() => {
              this.apolloMutation(RequestStatus, {
                id: data.Request_RequestCreate.res._id,
                type: 'Проверка тех возможности',
              }).then(() => {
                this.request.tarifsIdList = []
              })
            })
          }
        })
      }

      this.$refs.form.reset()
      this.dialog = false
    }
  }
}