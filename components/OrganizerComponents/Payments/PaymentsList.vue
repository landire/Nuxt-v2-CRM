<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :items="computedReports" class="elevation-1" hide-default-footer :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Отчетность по платежам</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn :disabled="loader" class="success" icon dark @click="dialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="districtsPayDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Платежи вошедшие в район</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-data-table :loading-text="'Идет загрузка данных...'" :headers="districtsTitles"
                    :items="districtsPay" class="elevation-1" hide-default-footer :page.sync="districtsPage"
                    :items-per-page="districtsItemsPerPage" @page-count="districtsPageCount = $event"></v-data-table>

                  <div class="text-center pt-2">
                    <v-pagination v-model="districtsPage" :length="districtsPageCount"></v-pagination>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Создание отчета</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form">
                    <v-row class="justify-center">
                      <v-col cols="2">
                        <v-text-field placeholder="Год*" prefix="20" v-model="year" :maxlength="2"></v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-select label="Месяц*" v-model="month" :items="monthList"></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
                <small>*обязательное поле</small>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn class="success" icon large dark @click="saveReport">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>

          <v-dialog v-model="overwriteDialog" max-width="500px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Отчет с такой датой уже создан.</span>
                <span>Вы уверены что хотите перезаписать его ?</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="accept">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="decline">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.districtsList="{ item }">
          <v-btn class="primary" @click="showDistrictsPay(item)" icon dark>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.loadingIcon="{ item }">
          <KeepAlive>
            <v-icon v-if="!item.loading" color="green" title="Выполнено">mdi-check-bold</v-icon>
            <v-icon v-if="item.loading" class="loader" color="primary" title="Загружается">mdi-loading</v-icon>
          </KeepAlive>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import { PayReportCreate } from '~/apollo/mutation/Reports'
import PaymentModel from '~/model/Payment/PaymentModel'
import DistrictsModel from '~/model/District/DistrictsModel'

export default {
  components: { RoutePanel },
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
</script>