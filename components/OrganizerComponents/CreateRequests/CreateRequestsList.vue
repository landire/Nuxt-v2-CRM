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
import script from './script'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import RequestCreate from '~/components/ButtonComponents/Request/RequestCreate.vue'

export default {
  mixins: [script],
  components: { RequestCreate, RoutePanel }
}
</script>