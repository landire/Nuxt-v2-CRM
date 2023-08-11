<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :search="tarif" :custom-filter="filterTarif" :loading="apolloLoading"
        :loading-text="'Идет загрузка данных...'" :headers="titles" :items="tarifs" class="elevation-1"
        hide-default-footer :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field prepend-inner-icon="mdi-magnify" class="mt-7" v-model="tarif" label="Поиск" outlined rounded
                clearable></v-text-field>
              <v-spacer></v-spacer>
              <v-btn :disabled="loader" title="Обновить из Биллинга" height="50px" class="primary darken-1 mr-2" icon dark
                @click="update">
                <KeepAlive>
                  <v-icon v-if="!loader">mdi-autorenew</v-icon>
                  <v-icon class="loader">mdi-autorenew</v-icon>
                </KeepAlive>
              </v-btn>
            </v-toolbar>
          </v-container>
        </template>
        <template v-slot:item.checkFlag="{ item }">
          <v-simple-checkbox class="d-inline-block" color="primary darken-2" v-model="item.flagWatchUser" light
            @click="checkFlag(item)"></v-simple-checkbox>
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