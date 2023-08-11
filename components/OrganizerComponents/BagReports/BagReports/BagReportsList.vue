<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="bugReportTitles"
        :search="`${priorityType}`" :custom-filter="filterPriority" :items="computedReport" class="elevation-1"
        hide-default-footer :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-row>
              <v-col cols="8">
                <v-select outlined label="Статусы" :items="statusList" v-model="statusType" clearable rounded></v-select>
              </v-col>
              <v-col cols="4">
                <span class="ml-3" style="font-size: small;">Приоритет заявки</span>
                <v-rating clearable size="30" color="#FBB117" background-color="black" v-model="priorityType"
                  hover></v-rating>
              </v-col>
            </v-row>
          </v-container>
        </template>

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
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import script from './script'

export default {
  mixins: [script],
  components: { RoutePanel }
}
</script>