import { BagReportDelete, BagReportEdit } from '~/apollo/mutation/BagReport'
import UserIdBagReportModel from '~/model/BagReport/UserIdBagReportModel'

export default {
  mixins: [UserIdBagReportModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      openImageDialog: false,
      reportRemoveDialog: false,
      reportEditDialog: false,
      imageBase64: "",
      bugReports: [],
      editedReport: {},
      apolloLoading: true,
      bugReportTitles: [
        { text: "Статус заявки", align: "center", value: "statusRu" },
        { text: "Тема", align: "center", value: "tema" },
        { text: "", align: "center", value: "edit", sortable: false },
        { text: "", align: "center", value: "delete", sortable: false },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Мои отчеты об ошибках", path: "/mybagreports" },
      ],
    };
  },

  async mounted() {
    const { data, subscription } = await this.getBagReportFromUserId([this.$store.state.decodedToken.id])
    this.bugReports = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
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
  },

  computed: {
    compBugReport() {
      this.bugReports = this.bugReports.map(rep => {
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

      return this.bugReports
    },
  },

  methods: {
    async acceptRemoveReport() {
      this.apolloMutation(BagReportDelete, {
        idList: [this.editedReport.id]
      });
      this.declineRemoveReport();
    },
    async declineRemoveReport() {
      this.reportRemoveDialog = false;
    },
    async openImage(item) {
      this.openImageDialog = true;
      this.imageBase64 = item.img;
    },
    async deleteReport(item) {
      this.editedReport = item;
      this.reportRemoveDialog = true;
    },
    async editReport(item) {
      this.editedReport = item;
      this.reportEditDialog = true;
    },
    async acceptEditReport() {
      this.apolloMutation(BagReportEdit, {
        param: {
          tema: this.editedReport.tema,
          text: this.editedReport.text
        },
        idList: [this.editedReport.id]
      });
      this.reportEditDialog = false;
    },
  },
}