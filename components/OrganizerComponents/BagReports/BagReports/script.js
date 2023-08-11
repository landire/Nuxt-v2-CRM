import BagReportModel from '~/model/BagReport/BagReportModel'
import UsersModel from '~/model/User/UsersModel'

export default {
  mixins: [BagReportModel, UsersModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      bugReportTitles: [
        { text: "Статус", align: "center", value: "statusRu" },
        { text: "Тема", align: "center", value: "title" },
        { text: "Ответственный админ", align: "center", value: "adminUserName", sortable: false },
        { text: "Владелец заявки", align: "center", value: "ownerName", sortable: false },
        { text: "Приоритет", align: "center", value: "priority", sortable: false },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Отчеты об ошибках", path: "/bagreports" },
      ],
      bugReports: [],
      users: [],
      statusList: ["Создана", "Обрабатывается", "Выполнена", "Закрыта"],
      statusType: null,
      priorityType: 0,
    };
  },
  async mounted() {
    const bugReports = await this.getBagReport()
    this.bugReports = bugReports.data
    this.apolloLoading = this.$apollo.loading

    bugReports.subscription((data) => {
      if (data.Subscription_BagReport.status !== 'Удален') {
        const idArray = this.bugReports.map(rep => rep.id)

        if (!idArray.includes(data.Subscription_BagReport.id)) {
          this.bugReports.push(data.Subscription_BagReport)
        }

        if (idArray.includes(data.Subscription_BagReport.id)) {
          this.bugReports = this.bugReports.map(rep => {
            if (rep.id === data.Subscription_BagReport.id) {
              rep = data.Subscription_BagReport
            }

            return rep
          })
        }
      } else {
        this.bugReports = this.bugReports.map(rep => {
          if (rep.id === data.Subscription_BagReport.id) {
            rep = data.Subscription_BagReport
          }

          return rep
        })

        this.bugReports = this.bugReports.filter(rep => rep.id !== data.Subscription_BagReport.id)
      }
    })

    const users = await this.getUsers()
    this.users = users.data

    users.subscription((data) => {
      const idList = this.users.map(user => user.id)

      if (!idList.includes(data.Subscription_User.id)) {
        this.users.push(data.Subscription_User)
      }

      if (idList.includes(data.Subscription_User.id)) {
        this.users = this.users.map(user => {
          if (user.id === data.Subscription_User.id) {
            user = data.Subscription_User
          }

          return user
        })
      }
    })
  },
  computed: {
    computedReport() {
      this.bugReports = this.bugReports.map(rep => {
        this.users.forEach(user => {
          if (user.id === rep.adminUserId) {
            rep.adminUserName = user.name;
          }

          if (rep.userId === user.id) {
            rep.ownerName = user.name;
          }
        })

        if (rep.status === "Created") {
          rep.statusRu = "Создана";
        }
        if (rep.status === "InService") {
          rep.statusRu = "Обрабатывается";
        }
        if (rep.status === "Done") {
          rep.statusRu = "Выполнена";
        }
        if (rep.status === "Finish") {
          rep.statusRu = "Закрыта";
        }

        return rep
      })

      return this.bugReports.filter(rep => {
        return !this.statusType || (rep.statusRu === this.statusType);
      })
    }
  },
  methods: {
    filterPriority(value, search, item) {
      if (search !== "0") {
        return search === `${item.prioritet}`;
      }
      return value;
    },
  },
}