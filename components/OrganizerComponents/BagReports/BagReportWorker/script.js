import AdminUserIdBagReportModel from '~/model/BagReport/AdminUserIdBagReportModel'

export default {
  mixins: [AdminUserIdBagReportModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      adminReportsTitle: [
        { text: "Статус заявки", align: "center", value: "statusRu" },
        { text: "Тема", align: "center", value: "title" },
        { text: "Приоритет", align: "center", value: "priority", sortable: false },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Отчеты в работе", path: "/worker" },
      ],
      adminReports: [],
    };
  },

  async mounted() {
    const { data, subscription } = await this.getBagReportFromAdminUserId([this.$store.state.decodedToken.id])
    this.adminReports = data.filter(rep => rep.status === 'InService')
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      if (data.Subscription_BagReport.status !== 'Удален') {
        const idArray = this.adminReports.map(rep => rep.id)

        if (!idArray.includes(data.Subscription_BagReport.id)) {
          this.adminReports.push(data.Subscription_BagReport)
        }

        if (idArray.includes(data.Subscription_BagReport.id)) {
          this.adminReports = this.adminReports.map(rep => {
            if (rep.id === data.Subscription_BagReport.id) {
              rep = data.Subscription_BagReport
            }

            return rep
          })
        }
      } else {
        this.adminReports = this.adminReports.map(rep => {
          if (rep.id === data.Subscription_BagReport.id) {
            rep = data.Subscription_BagReport
          }
          return rep
        })

        this.adminReports = this.adminReports.filter(rep => rep.id !== data.Subscription_BagReport.id)
      }

      this.adminReports = this.adminReports.filter(rep => rep.status === 'InService')
    })
  },
  computed: {
    compAdminBugReport() {
      this.adminReports = this.adminReports.map(rep => {
        if (rep.status === "InService") {
          rep.statusRu = "Обрабатывается";
        }
        return rep;
      })

      return this.adminReports;
    },
  },
}