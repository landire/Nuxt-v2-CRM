<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="adminReportsTitle"
        :items="compAdminBugReport" class="elevation-1" hide-default-footer :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">

        <template v-slot:item.title="{ item }">
          <NuxtLink class="item-link" :to="`/bagreports/${item.id}`">{{ item.tema }}</NuxtLink>
        </template>
        <template v-slot:item.priority="{ item }">
          <v-rating readonly color="#FBB117" background-color="black" v-model="item.prioritet" hover></v-rating>
        </template>
      </v-data-table>

      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import script from './script'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'

export default {
  mixins: [script],
  components: { RoutePanel }
}
</script>