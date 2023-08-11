import ParentIdBagReportModel from '~/model/BagReport/ParentIdBagReportModel'
import UsersModel from '~/model/User/UsersModel'

export default {
  mixins: [ParentIdBagReportModel, UsersModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      childReport: [],
      apolloLoading: true,
      users: [],
      childReportTitle: [
        { text: 'Статус', align: 'center', value: 'statusRu', sortable: false },
        { text: 'Тема', align: 'center', value: 'reportTema', sortable: false },
        { text: 'Ответственный админ', align: 'center', value: 'adminUserName', sortable: false }
      ],
    }
  },

  async mounted() {
    const bagReport = await this.getBagReportFromParentId([this.$route.params.id])
    this.childReport = bagReport.data
    this.apolloLoading = this.$apollo.loading

    bagReport.subscription((data) => {
      if (data.Subscription_BagReport.status !== 'Удален') {
        const idArray = this.childReport.map(rep => rep.id)

        if (!idArray.includes(data.Subscription_BagReport.id)) {
          this.childReport.push(data.Subscription_BagReport)
        }
        if (idArray.includes(data.Subscription_BagReport.id)) {
          this.childReport = this.childReport.map(rep => {
            if (rep.id === data.Subscription_BagReport.id) {
              rep = data.Subscription_BagReport
            }

            return rep
          })
        }
      } else {
        this.childReport = this.childReport.map(rep => {
          if (rep.id === data.Subscription_BagReport.id) {
            rep = data.Subscription_BagReport
          }

          return rep
        })

        this.childReport = this.childReport.filter(rep => rep.id !== data.Subscription_BagReport.id)
      }
    })

    const users = await this.getUsers(false)
    this.users = users.data
  },

  computed: {
    compChildReport() {
      this.childReport = this.childReport.map(rep => {
        this.users.forEach(user => {
          if (user.id === rep.adminUserId) {
            rep.adminUserName = user.name
          }
        })

        if (rep.status === 'Created') {
          rep.statusRu = 'Создана'
        }
        if (rep.status === 'InService') {
          rep.statusRu = 'Обрабатывается'
        }
        if (rep.status === 'Done') {
          rep.statusRu = 'Выполнена'
        }
        if (rep.status === 'Finish') {
          rep.statusRu = 'Закрыта'
        }

        return rep
      })

      return this.childReport
    },
  }
}