<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="userTitles"
        :items="users" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Список пользователей</v-toolbar-title>
              <v-spacer></v-spacer>
              <UserCreate class="mr-3 mt-1" />
            </v-toolbar>
          </v-container>
        </template>

        <template v-slot:item.title="{ item }">
          <NuxtLink class="item-link" :to="`/admin/users/${item.id}`">{{ item.name }}</NuxtLink>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import UserCreate from '~/components/ButtonComponents/User/UserCreate.vue'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import UsersModel from '~/model/User/UsersModel'

export default {
  components: { UserCreate, RoutePanel },
  mixins: [UsersModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      userTitles: [
        { text: 'Имя пользователя', align: 'center', value: 'title' },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Кабинет администратора', path: '/admin' },
        { name: 'Пользователи', path: '/admin/users' },
      ],
      users: []
    }
  },

  async mounted() {
    const { data, subscription } = await this.getUsers()
    this.users = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
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
}
</script>