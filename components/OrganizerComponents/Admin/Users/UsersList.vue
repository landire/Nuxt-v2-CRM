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
import script from './script'

export default {
  mixins: [script],
  components: { UserCreate, RoutePanel },
}
</script>