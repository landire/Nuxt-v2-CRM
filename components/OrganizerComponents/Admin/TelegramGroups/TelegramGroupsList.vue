<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles" :items="tgGroups"
        class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Список телеграмм групп</v-toolbar-title>
            </v-toolbar>
          </v-container>
        </template>

        <template v-slot:item.title="{ item }">
          <NuxtLink class="item-link" :to="`/admin/telegram/${item.id}`">{{ item.name }}</NuxtLink>
        </template>
      </v-data-table>
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