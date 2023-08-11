import PaymentModel from '~/model/Payment/PaymentModel'
import DistrictsModel from '~/model/District/DistrictsModel'

export default {
  mixins: [PaymentModel, DistrictsModel],
  data() {
    return {
      dialog: false,
      reports: [],
      reportsFromDate: [],
      dateList: [],
      label: '',
      labels: [],
      data: [],
      color: '',
      otDate: null,
      doDate: null,
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Поступления', path: '/income' },
      ],
      districts: [],
      districtsList: [],
      districtsLabels: [],
      districtsData: [],
      selectedDistricts: [],
      date: ''
    };
  },
  async mounted() {
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
    pieData() {
      this.districtsData = this.districts.map(dist => {
        if (this.selectedDistricts.includes(dist.name)) {
          return dist.amount;
        }
      }).filter(amount => amount !== undefined);
      this.districtsLabels = this.districts.map(dist => {
        if (this.selectedDistricts.includes(dist.name)) {
          return dist.name;
        }
      }).filter(name => name !== undefined);
      return {
        labels: this.districtsLabels,
        datasets: [
          {
            label: "Сумма по району",
            data: this.districtsData,
            backgroundColor: ["#f3a683", "#f7d794", "#778beb", "#e77f67", "#cf6a87", "#786fa6", "#f8a5c2"],
          },
        ],
      };
    },
    barData() {
      this.reports = this.reports.map(rep => {
        rep.date = new Date(rep.year, rep.month - 1);
        rep.amount = Number(rep.amount.toFixed(2));
        rep.districts.forEach(dist => {
          dist.amount = Number(dist.amount.toFixed(2));
        });
        rep.dateString = rep.date.toLocaleString("en-GB", { year: "numeric", month: "numeric" });
        return rep;
      });
      this.reports = this.reports.sort((a, b) => a.date > b.date);
      this.dateList = this.reports.map(rep => rep.dateString);
      if (this.otDate !== null && this.doDate !== null) {
        this.reportsFromDate = this.reports.map(rep => {
          const otMonth = Array.prototype.slice.call(this.otDate, 0, 2).join("");
          const otYear = Array.prototype.slice.call(this.otDate, 3).join("");
          const doMonth = Array.prototype.slice.call(this.doDate, 0, 2).join("");
          const doYear = Array.prototype.slice.call(this.doDate, 3).join("");
          const otDate = new Date(otYear, otMonth - 1);
          const doDate = new Date(doYear, doMonth - 1);
          if (rep.date >= otDate && rep.date <= doDate) {
            return rep;
          }
        }).filter(rep => rep !== undefined);
        this.data = this.reportsFromDate.map(rep => rep.amount);
        this.labels = this.reportsFromDate.map(rep => rep.dateString);
        this.label = "Сумма за месяц";
      }
      if (this.otDate === null || this.doDate === null) {
        this.labels = this.reports.map(rep => rep.dateString);
        this.data = this.reports.map(rep => rep.amount);
        this.label = "Сумма за месяц";
      }
      this.color = "#1E88E5";
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            data: this.data,
            backgroundColor: this.color,
          },
        ],
      };
    },
    barOptions() {
      return {
        onClick: (ctx, array) => {
          if (array.length !== 0) {
            array.forEach(item => {
              this.reports.forEach(rep => {
                if (rep.dateString === item._model.label) {
                  this.districts = rep.districts;
                  this.districtsList = rep.districts.map(dist => dist.name);
                  this.selectedDistricts = rep.districts.sort((a, b) => b.amount > a.amount).map(dist => dist.name).splice(0, 5);
                  this.date = item._model.label;
                }
              });
            });
            this.dialog = true;
          }
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: Math.min(...this.reports.map(rep => rep.amount)) - 250000
            }
          }]
        },
        maintainAspectRatio: false,
        responsive: true,
      };
    }
  },
}