<template>
  <div>
    <RoutePanel :link-list="links" />
    <div class="d-block justify-center flex-column ma-3" v-for="dis in district" :key="dis.id">
      <fieldset class="box-container text-center">
        <span class="text-h5 pa-5">Информация о районе</span>
        <v-text-field class="mr-3 ml-3 mt-5" v-model="dis.name" label="Название" outlined disabled></v-text-field>

      </fieldset>
      <fieldset class="box-container text-center mt-5">
        <span class="text-h5 pa-5">Списки домов</span>

        <v-row class="ma-2" justify="center">
          <v-col cols="6">
            <v-data-table :loading-text="'Идет загрузка данных...'" :headers="currHousesTitles" :items="updatedCurrHouses"
              class="elevation-1" hide-default-footer :page.sync="currPage" :items-per-page="currItemsPerPage"
              @page-count="currPageCount = $event">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-row>
                    <v-col>
                      <v-toolbar-title>Список домов района: {{ dis.name }}</v-toolbar-title>
                    </v-col>
                  </v-row>
                </v-toolbar>
              </template>
              <template v-slot:item.remove="{ item }">
                <v-btn class="red" icon dark @click="removeHouse(item)"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="currPage" :length="currPageCount"></v-pagination>
            </div>
          </v-col>

          <v-col cols="6">
            <v-data-table :loading="apolloLoading" :search="searchAllHouses" :loading-text="'Идет загрузка данных...'"
              :headers="allHousesTitles" :items="updatedAllHouses" class="elevation-1" hide-default-footer
              :page.sync="allPage" :items-per-page="allItemsPerPage" @page-count="allPageCount = $event">
              <template v-slot:top>
                <v-container>
                  <v-toolbar flat>
                    <v-text-field label="Поиск по названию" prepend-inner-icon="mdi-magnify" class="mt-9"
                      v-model="searchAllHouses" outlined rounded clearable></v-text-field>
                  </v-toolbar>
                </v-container>
              </template>
              <template v-slot:item.add="{ item }">
                <v-btn class="primary" dark icon @click="addHouse(item)"><v-icon>mdi-plus</v-icon></v-btn>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="allPage" :length="allPageCount"></v-pagination>
            </div>
          </v-col>
        </v-row>
      </fieldset>
    </div>
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