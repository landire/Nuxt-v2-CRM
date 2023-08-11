import { UfmsEdit, UfmsDelete } from '~/apollo/mutation/Ufms'
import UfmsModel from '~/model/Ufms/UfmsModel'

export default {
  mixins: [UfmsModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      dialog: false,
      ufmsDeleteDialog: false,
      apolloLoading: true,
      titles: [
        { text: 'Кем выдан', align: 'center', value: 'name' },
        { text: 'Код подразделения', align: 'center', value: 'structureCod' },
        { text: '', align: 'center', value: 'editUfms', sortable: false },
        { text: '', align: 'center', value: 'deleteUfms', sortable: false }
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Справочник отделений УФМС', path: '/ufms' },
      ],
      ufms: [],
      editedUfms: {},
      codeUfms: '',
    }
  },

  async mounted() {
    const { data, subscription } = await this.getUfms()
    this.ufms = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      if (data.Subscription_Ufms.name !== 'Удален') {
        const idArray = this.ufms.map(ufms => ufms.id)
        if (!idArray.includes(data.Subscription_Ufms.id)) {
          this.ufms.push(data.Subscription_Ufms)
        }
        if (idArray.includes(data.Subscription_Ufms.id)) {
          this.ufms = this.ufms.map(ufms => {
            if (ufms.id === data.Subscription_Ufms.id) {
              ufms = data.Subscription_Ufms
            }
            return ufms
          })
        }
      } else {
        this.ufms = this.ufms.map(ufms => {
          if (ufms.id === data.Subscription_Ufms.id) {
            ufms = data.Subscription_Ufms
          }
          return ufms
        })
        this.ufms = this.ufms.filter(ufms => ufms.id !== data.Subscription_Ufms.id)
      }
    })
  },

  methods: {
    filterCodeUfms(value, search, item) {
      if (search.length >= 3) {
        return search === Array.prototype.slice.call(item.structureCod, 0, search.length).join('')
      }
      return value
    },

    // Метод кнопки Редактирования Роли
    async editUfms(item) {
      this.editedUfms = item
      this.dialog = true
    },
    // Метод кнопки сохранения измененной Роли
    async save() {
      this.apolloMutation(UfmsEdit, {
        idList: [this.editedUfms.id],
        param: {
          name: this.editedUfms.name,
          structureCod: this.editedUfms.structureCod
        }
      })
      this.dialog = false
    },
    // Метод кнопки Удаления Роли
    async deleteUfms(item) {
      this.editedUfms = item
      this.ufmsDeleteDialog = true
    },
    // Метод кнопки отмены Удаления Роли
    async declineDeleteUfms() {
      this.ufmsDeleteDialog = false
    },
    // Метод кнопки принятия Удаления Роли
    async acceptDeleteUfms() {
      this.apolloMutation(UfmsDelete, {
        idList: [this.editedUfms.id]
      })
      this.declineDeleteUfms()
    }
  },
}