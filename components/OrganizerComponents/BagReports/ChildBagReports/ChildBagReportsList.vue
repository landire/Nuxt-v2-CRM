<template>
  <KeepAlive>
    <v-container v-if="childReport.length !== 0" class="box-container ma-3">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="childReportTitle"
        :items="compChildReport" class="elevation-1" hide-default-footer :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <span style="place-self: center;" class="text-h5">Подчиненные заявка</span>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>

        <template v-slot:item.reportTema="{ item }">
          <NuxtLink class="item-link" :to="`/bagreports/${item.id}`">{{ item.tema }}</NuxtLink>
        </template>
        <template v-slot:item.childAdmin="{ item }">
          <span>{{ item.adminUserName }}</span>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </KeepAlive>
</template>

<script>
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
</script>