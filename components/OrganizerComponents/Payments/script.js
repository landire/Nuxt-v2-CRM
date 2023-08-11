import { PayReportCreate } from '~/apollo/mutation/Reports'
import PaymentModel from '~/model/Payment/PaymentModel'
import DistrictsModel from '~/model/District/DistrictsModel'

export default {
  mixins: [PaymentModel, DistrictsModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      districtsPage: 1,
      districtsPageCount: 0,
      districtsItemsPerPage: 10,
      apolloLoading: true,
      loader: false,
      districtsPayDialog: false,
      districtsPay: [],
      titles: [
        { text: "Статус", align: "center", value: "loadingIcon", sortable: false },
        { text: "Дата выгрузки", align: "center", value: "dateString" },
        { text: "Количество платежей", align: "center", value: "count" },
        { text: "Сумма за месяц", align: "center", value: "amount" },
        { text: "Платежи не вошедшие в район", align: "center", value: "notDistricts" },
        { text: "Платежи вошедшие в район", align: "center", value: "districtsList", sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Платежи', path: '/payments' },
      ],
      districtsTitles: [
        { text: "Название района", align: "center", value: "name" },
        { text: "Количество платежей", align: "center", value: "countD" },
        { text: "Сумма за месяц", align: "center", value: "amount" },
      ],
      reports: [],
      dialog: false,
      overwriteDialog: false,
      year: "",
      month: "",
      monthList: [],
    };
  },

  async mounted() {
    for (let i = 0; i < 12; i++) {
      this.monthList[i] = i + 1;
    }

    const payments = await this.getPayment()
    this.reports = payments.data
    this.apolloLoading = this.$apollo.loading

    payments.subscription((data) => {
      this.reports = this.reports.map(rep => {
        if (data.Subscription_PayReport.year === rep.year && data.Subscription_PayReport.month === rep.month) {
          rep.loading = true

          if (data.Subscription_PayReport.count !== 0) {
            rep.loading = false
          }

          rep = data.Subscription_PayReport
          rep.id = data.Subscription_PayReport._id
        }

        return rep
      })

      const idList = this.reports.map(rep => rep.id)

      if (!idList.includes(data.Subscription_PayReport._id)) {
        this.reports.push(data.Subscription_PayReport)
      }
    })

    const districts = await this.getDistricts()

    this.reports = payments.data.map(rep => {
      rep.districts.forEach(repDist => {
        districts.data.forEach(dist => {
          if (repDist.id === dist.id) {
            repDist.name = dist.name
          }
        })
      })

      return rep
    })
  },
  computed: {
    computedReports() {
      this.reports = this.reports.map(rep => {
        rep.date = new Date(rep.year, rep.month - 1);
        if (rep.count === 0) {
          rep.loading = true;
        }
        else {
          rep.loading = false;
        }
        rep.amount = Number(rep.amount.toFixed(2));
        rep.districts.forEach(dist => {
          dist.amount = Number(dist.amount.toFixed(2));
        });
        rep.dateString = rep.date.toLocaleString("en-GB", { year: "numeric", month: "numeric" });
        return rep;
      });
      this.reports = this.reports.sort((a, b) => a.date > b.date)
      this.loader = this.reports.some(rep => rep.loading === true)

      return this.reports
    }
  },
  methods: {
    async showDistrictsPay(item) {
      this.districtsPayDialog = true;
      this.districtsPay = item.districts;
    },
    async saveReport() {
      this.reports.forEach(rep => {
        if (rep.year === Number(`20${this.year}`) && rep.month === this.month) {
          this.overwriteDialog = true;
        }
      });
      if (!this.overwriteDialog) {
        this.apolloMutation(PayReportCreate, {
          year: Number(`20${this.year}`),
          month: this.month,
          isOverwrite: false,
        });
        this.dialog = false;
      }
    },
    async decline() {
      this.overwriteDialog = false;
    },
    async accept() {
      this.apolloMutation(PayReportCreate, {
        year: Number(`20${this.year}`),
        month: this.month,
        isOverwrite: true,
      });
      this.reports = this.reports.map(rep => {
        if (rep.year === Number(`20${this.year}`) && rep.month === this.month) {
          rep.loading = true;
        }
        return rep;
      });
      this.dialog = false;
      this.overwriteDialog = false;
      this.$refs.form.reset();
    }
  },
}