import { BagReportEdit } from '~/apollo/mutation/BagReport'
import IdBagReportModel from '~/model/BagReport/IdBagReportModel'
import UserRoleModel from '~/model/UserRole/UserRoleModel'
import UsersModel from '~/model/User/UsersModel'
import NameRoleModel from '~/model/Role/NameRoleModel'

export default {
  mixins: [IdBagReportModel, UserRoleModel, UsersModel, NameRoleModel],
  data() {
    return {
      parentReport: [],
      users: [],
      roles: [],
      userRoles: [],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Отчеты об ошибках", path: "/bagreports" },
        { name: "Отчет об ошибке", path: this.$route.path },
      ],
      reportAdmins: [],
      currentReport: [],
      openImageDialog: false,
    }
  },

  async mounted() {
    const users = await this.getUsers()
    this.users = users.data

    const userRoles = await this.getUserRole(this.users.map(user => user.id))
    this.userRoles = userRoles.data

    const roles = await this.getRoleFromName('BagReportWorker')
    this.roles = roles.data

    const currentBugReport = await this.getBagReportFromId([this.$route.params.id])
    this.currentReport = currentBugReport.data

    currentBugReport.subscription(async (data) => {
      if (data.Subscription_BagReport.status !== 'Удален') {
        const subParentReport = await this.getBagReportFromId([data.Subscription_BagReport.parentBagreportId], false)
        this.parentReport = subParentReport.data

        this.currentReport = this.currentReport.map(rep => {
          rep = data.Subscription_BagReport
          this.users.forEach(user => {
            if (user.id === rep.userId) {
              rep.ownerName = user.name
            }
          })

          return rep
        })
      } else {
        this.currentReport = this.currentReport.map(rep => {
          rep = data.Subscription_BagReport

          return rep
        })

        this.currentReport = this.currentReport.filter(rep => rep.id !== data.Subscription_BagReport.id)
      }
    })


    const parentBugReport = await this.getBagReportFromId(this.currentReport.map(rep => rep.parentBagreportId))
    this.parentReport = parentBugReport.data
  },

  computed: {
    compCurrentReport() {
      this.currentReport = this.currentReport.map(rep => {
        this.users.forEach(user => {
          if (user.id === rep.adminUserId) {
            rep.adminUserName = user.name
          }

          if (rep.userId === user.id) {
            rep.ownerName = user.name
          }
        })

        if (rep.status === 'Created') {
          rep.statusRu = 'Создан'
        }
        if (rep.status === 'InService') {
          rep.statusRu = 'Обрабатывается'
        }
        if (rep.status === 'Done') {
          rep.statusRu = 'Выполнена'
        }
        if (rep.status === 'Finish') {
          rep.statusRu = 'Закрыт'
        }

        return rep
      })

      this.users.forEach(user => {
        this.userRoles.forEach(userRole => {
          if (user.id === userRole.userId && userRole.RoleList.includes(this.roles.find(role => role.id)?.id)) {
            this.reportAdmins.push(user.name)
          }
        })
      })

      return this.currentReport
    }
  },

  methods: {
    async addParentReport(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          parentBagreportId: item.parentBagreportId,
        },
        idList: [item.id]
      })
    },

    async changePriority(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          prioritet: item.prioritet
        },
        idList: [item.id]
      })
    },

    async linkBugReportAdmin(item) {
      this.users.forEach(user => {
        if (user.name === item.adminUserName) {
          this.apolloMutation(BagReportEdit, {
            param: {
              status: 'InService',
              adminUserId: user.id
            },
            idList: [item.id]
          })
        }
      })
    },

    async closeReport(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          status: 'Finish'
        },
        idList: [item.id]
      })
    },

    async doneReport(item) {
      this.apolloMutation(BagReportEdit, {
        param: {
          status: 'Done'
        },
        idList: [item.id]
      })
    }
  }
}