<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :items="updatedClients" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">

        <template v-slot:top>

          <v-dialog v-model="billingAdresDialog" max-width="600px">
            <v-card>
              <v-card-actions>
                <v-container class="text-center">
                  <v-select label="Районы" v-model="editedClient.districtName" :items="editedClient.districtsNames"
                    outlined @change="selectDist"></v-select>
                  <KeepAlive>
                    <v-select v-if="editedClient.district" label="Адреса" v-model="editedClient.adresBilling"
                      :items="editedClient.district.housesList" outlined></v-select>
                  </KeepAlive>
                  <v-btn class="primary" :disabled="!editedClient.adresBilling" @click="addAdres">Добавить адрес</v-btn>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.addBillingAdres="{ item }">
          <v-btn title="Добавить адрес из биллинга" dark class="success" icon @click="addAdresDialog(item)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
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