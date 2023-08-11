<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :items="computedReports" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Отчетность по платежам</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn :disabled="loader" class="success" icon dark @click="dialog = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="districtsPayDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Платежи вошедшие в район</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-data-table :loading-text="'Идет загрузка данных...'" :headers="districtsTitles" :items="districtsPay"
                    class="elevation-1" hide-default-footer :page.sync="districtsPage"
                    :items-per-page="districtsItemsPerPage" @page-count="districtsPageCount = $event"></v-data-table>

                  <div class="text-center pt-2">
                    <v-pagination v-model="districtsPage" :length="districtsPageCount"></v-pagination>
                  </div>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Создание отчета</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form">
                    <v-row class="justify-center">
                      <v-col cols="2">
                        <v-text-field placeholder="Год*" prefix="20" v-model="year" :maxlength="2"></v-text-field>
                      </v-col>
                      <v-col cols="5">
                        <v-select label="Месяц*" v-model="month" :items="monthList"></v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
                <small>*обязательное поле</small>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn class="success" icon large dark @click="saveReport">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>

          <v-dialog v-model="overwriteDialog" max-width="500px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Отчет с такой датой уже создан.</span>
                <span>Вы уверены что хотите перезаписать его ?</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="accept">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="decline">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <template v-slot:item.districtsList="{ item }">
          <v-btn class="primary" @click="showDistrictsPay(item)" icon dark>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>

        <template v-slot:item.loadingIcon="{ item }">
          <KeepAlive>
            <v-icon v-if="!item.loading" color="green" title="Выполнено">mdi-check-bold</v-icon>
            <v-icon v-if="item.loading" class="loader" color="primary" title="Загружается">mdi-loading</v-icon>
          </KeepAlive>
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