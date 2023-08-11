<template>
  <v-container class="box-container ma-3">
    <v-data-table :loading="apolloParentLoading" :loading-text="'Идет загрузка данных...'" :headers="parentReportTitle"
      :items="compParentReport" class="elevation-1" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <span style="place-self: center;" class="text-h5">Родительская заявка</span>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:item.reportTema="{ item }">
        <NuxtLink class="item-link" :to="`/bagreports/${item.id}`">{{ item.tema }}</NuxtLink>
      </template>
      <template v-slot:item.parentAdmin="{ item }">
        <span>{{ item.adminUserName }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import script from './script'

export default {
  mixins: [script]
}
</script>