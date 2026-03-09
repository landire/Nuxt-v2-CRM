<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="headers"
        :items="updateRequest" class="elevation-1" hide-default-footer :search="search" :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field class="search-field mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Поиск"
                v-model="search" outlined rounded clearable />
              <v-spacer></v-spacer>
              <RequestCreate class="mr-3 mt-1" />
            </v-toolbar>
          </v-container>

          <v-dialog v-model="reqDeleteDialog" max-width="300px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Вы уверены ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptDeleteReq">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineDeleteReq">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.deleteReq="{ item }">
          <v-btn icon dark class="error" @click="deleteReq(item)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.search-field {
  max-width: 50%;
}
</style>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import RequestCreate from '~/components/ButtonComponents/Request/RequestCreate.vue'
import { RequestDelete } from '~/apollo/mutation/Request'
import UserIdRequestModel from '~/model/Request/UserIdRequestModel'

export default {
  components: { RequestCreate, RoutePanel },
  mixins: [UserIdRequestModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      reqDeleteDialog: false,
      requests: [],
      apolloLoading: true,
      editedReq: {},
      typeList: ['Нет покрытия', 'Отказ', 'Не устроило', 'Проверка тех возможности'],
      headers: [
        { text: 'Фамилия', align: 'center', value: 'familiya' },
        { text: 'Статус', align: 'center', value: 'statusName' },
        { text: 'Дата', align: 'center', value: 'date' },
        { text: 'Прошло времени', align: 'center', value: 'passedTime' },
        { text: '', align: 'center', value: 'deleteReq', sortable: false },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Создание заявки', path: '/create' },
      ]
    }
  },

  computed: {
    updateRequest() {
      this.requests = this.requests.map(req => {
        // Корректировка времени (+3 ч)
        const correctDate = new Date(Date.parse(req.created))
        // Парсинг даты
        const time = correctDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        const date = correctDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' })
        req.date = `${date} ${time}`
        const psdTime = (Date.now() / 1000) - (Date.parse(correctDate) / 1000)
        if (Math.round(psdTime) <= 60) {
          req.passedTime = Math.round(psdTime) + ' сек'
        }
        if (Math.round(psdTime) > 60 && Math.round(psdTime) <= 3600) {
          req.passedTime = (Math.round(psdTime / 60)) + ' мин'
        }
        if (Math.round(psdTime) > 3600 && Math.round(psdTime) <= 86400) {
          req.passedTime = (Math.round(psdTime / 3600)) + ' ч'
        }
        if (Math.round(psdTime) > 86400) {
          req.passedTime = (Math.round(psdTime / 86400)) + ' д'
        }

        req.statusName = req.status?.map(stts => ' ' + stts.namestatus)

        return req
      })

      return this.requests
    }
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

  methods: {
    async deleteReq(item) {
      if (item.id !== undefined) {
        this.editedReq = item
        this.reqDeleteDialog = true
      }
    },

    async declineDeleteReq() {
      this.editedReq = {}
      this.reqDeleteDialog = false
    },

    async acceptDeleteReq() {
      this.apolloMutation(RequestDelete, {
        idList: [this.editedReq.id]
      })
      this.declineDeleteReq()
    },
  },
}
</script>