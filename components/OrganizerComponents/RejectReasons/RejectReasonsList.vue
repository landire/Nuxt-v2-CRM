<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles" :items="qControl"
        class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Причины отказа</v-toolbar-title>
              <v-spacer></v-spacer>
              <RejectReasonCreate class="mr-3 mt-1" />
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Редактирование</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="editedQControl.name" label="Название"></v-text-field>
                      <v-select label="Тип" v-model="editedQControl.type" :items="typeList"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn title="Подтвердить изменения" class="success" icon dark large @click="save">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.statusButton="{ item }">
          <v-simple-checkbox title="Вкл/Выкл" class="d-inline-block" color="primary darken-2" v-model="item.status" light
            @click="switchStatus(item)"></v-simple-checkbox>
        </template>
        <template v-slot:item.editQControl="{ item }">
          <v-btn title="Редактировать" icon dark class="primary"
            @click="editQControl(item)"><v-icon>mdi-pencil</v-icon></v-btn>
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
import RejectReasonCreate from '~/components/ButtonComponents/RejectReason/RejectReasonCreate.vue'

export default {
  mixins: [script],
  components: { RejectReasonCreate, RoutePanel }
}
</script>