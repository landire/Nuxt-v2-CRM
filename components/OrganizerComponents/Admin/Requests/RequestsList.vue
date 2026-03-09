<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="reqTitles"
        :items="updateRequest" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">
        <template v-slot:top>

        </template>

        <template v-slot:item.fio="{ item }">
          <NuxtLink class="item-link" :to="`/admin/requests/${item.id}`">{{ item.fio }}</NuxtLink>
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
import RequestModel from '~/model/Request/RequestModel'

export default {
  components: { RoutePanel },
  mixins: [RequestModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      reqTitles: [
        { text: "ФИО", align: "center", value: "fio" },
        { text: "Дата создания", align: "center", value: "date" },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Кабинет администратора', path: '/admin' },
        { name: 'Заявки', path: '/admin/requests' },
      ],
      requests: [],
    };
  },
  async mounted() {
    const { data, subscription } = await this.getRequest()
    this.requests = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      if (data.Subscription_Request.adres !== 'Удален') {
        const idArray = this.requests.map(req => req.id)

        if (!idArray.includes(data.Subscription_Request.id)) {
          this.requests.push(data.Subscription_Request)
        }
        if (idArray.includes(data.Subscription_Request.id)) {
          this.requests = this.requests.map(req => {
            if (req.id === data.Subscription_Request.id) {
              req = data.Subscription_Request
            }

            return req
          })
        }
      } else {
        this.requests = this.requests.map(req => {
          if (req.id === data.Subscription_Request.id) {
            req = data.Subscription_Request
          }

          return req
        })

        this.requests = this.requests.filter(req => req.id !== data.Subscription_Request.id)
      }
    })
  },
  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        req.fio = `${req.familiya} ${req.name} ${req.otchestvo}`

        const correctDate = new Date(Date.parse(req.created) + 600000);
        const time = correctDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
        const date = correctDate.toLocaleDateString("ru-RU", { year: "numeric", month: "numeric", day: "numeric" });
        req.date = `${date} ${time}`;

        return req;
      })

      return this.requests;
    }
  },
}
</script>