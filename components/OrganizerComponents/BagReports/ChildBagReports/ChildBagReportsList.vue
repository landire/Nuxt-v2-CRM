<template>
  <KeepAlive>
    <v-container v-if="childReport.length !== 0" class="box-container ma-3">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="childReportTitle"
        :items="compChildReport" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">
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
import script from './script'

export default {
  mixins: [script]
}
</script>