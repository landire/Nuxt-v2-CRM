<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="bugReportTitles"
        :items="compBugReport" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <BagReportCreate class="mr-5" />
            </v-toolbar>
          </v-container>

          <v-dialog v-model="openImageDialog" max-width="400px">
            <v-img :src="imageBase64"></v-img>
          </v-dialog>

          <v-dialog v-model="reportRemoveDialog" max-width="300px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Вы уверены ?</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptRemoveReport">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineRemoveReport">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="reportEditDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Редактирование</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-text-field v-model="editedReport.tema" label="Тема"></v-text-field>
                  <v-textarea v-model="editedReport.text" lable="Описание" outlined></v-textarea>
                </v-container>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn @click="acceptEditReport" dark icon large title="Сохранить" class="success mb-3">
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.image="{ item }">
          <v-btn :disabled="item.img === undefined" color="black" icon
            @click="openImage(item)"><v-icon>mdi-file</v-icon></v-btn>
        </template>
        <template v-slot:item.delete="{ item }">
          <v-btn title="Удалить" class="red" icon dark @click="deleteReport(item)"><v-icon>mdi-delete</v-icon></v-btn>
        </template>
        <template v-slot:item.edit="{ item }">
          <v-btn title="Редактировать" class="primary" icon dark
            @click="editReport(item)"><v-icon>mdi-pencil</v-icon></v-btn>
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
import BagReportCreate from '~/components/ButtonComponents/BagReports/BagReport/BagReportCreate.vue'
import script from './script'

export default {
  mixins: [script],
  components: { BagReportCreate, RoutePanel }
}
</script>