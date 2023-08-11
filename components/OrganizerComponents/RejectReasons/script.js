import { QualityControlEdit } from '~/apollo/mutation/QualityControl'
import QualityModel from '~/model/Quality/QualityModel'

export default {
  mixins: [QualityModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      dialog: false,
      editedQControl: {},
      titles: [
        { text: '', align: 'center', value: 'statusButton', sortable: false },
        { text: 'Название', align: 'center', value: 'name' },
        { text: 'Тип', align: 'center', value: 'type' },
        { text: '', align: 'center', value: 'editQControl', sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Причины отказа', path: '/rejectreasons' },
      ],
      qControl: [],
      typeList: ['Качество', 'Покрытие', 'Отказ'],
    }
  },

  async mounted() {
    const { data, subscription } = await this.getQuality()
    this.qControl = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      const idList = this.qControl.map(control => control.id)

      if (!idList.includes(data.Subscription_QualityControl.id)) {
        this.qControl.push(data.Subscription_QualityControl)
      }
      if (idList.includes(data.Subscription_QualityControl.id)) {
        this.qControl = this.qControl.map(control => {
          if (control.id === data.Subscription_QualityControl.id) {
            control = data.Subscription_QualityControl
          }

          return control
        })
      }
    })
  },

  methods: {
    async switchStatus(item) {
      this.apolloMutation(QualityControlEdit, {
        param: {
          status: item.status
        },
        idList: [item.id]
      })
    },

    async editQControl(item) {
      this.editedQControl = item
      this.dialog = true
    },

    async save() {
      this.apolloMutation(QualityControlEdit, {
        param: {
          name: this.editedQControl.name,
          type: this.editedQControl.type
        },
        idList: [this.editedQControl.id]
      })

      this.dialog = false
    },

    async close() {
      this.dialog = false
    }
  }
}