<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" class="elevation-1"
        hide-default-footer :search="search" :headers="titles" :items="updateRequest" :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field width="10px" class="mr-3 mt-10" prepend-inner-icon="mdi-magnify" label="Поиск"
                v-model="search" outlined rounded />
              <v-spacer></v-spacer>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span class="text-h5">Подключение</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field disabled v-model="editedReq.familiya" label="Фамилия"></v-text-field>
                      <v-text-field disabled v-model="editedReq.name" label="Имя"></v-text-field>
                      <v-text-field disabled v-model="editedReq.otchestvo" label="Отчество"></v-text-field>
                      <v-text-field disabled v-model="editedReq.adres" label="Адрес"></v-text-field>
                      <v-text-field disabled v-model="editedReq.fone" label="Телефон"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-container>
                  <div class="d-flex justify-center">
                    <v-select style="max-width: 60%;" :menu-props="{ offsetY: true }" label="Статус" :items="typeList"
                      v-model="editedReq.type" outlined clearable></v-select>
                  </div>
                  <v-row>
                    <v-col class="text-center" cols="12">
                      <v-btn title="Подтвердить статус" class="success" icon large dark @click="connectReq">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="deleteDialog" max-width="300px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Вы уверены ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptDelete">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineDelete">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.checkReq="{ item }">
          <v-btn icon dark class="primary" @click="checkReq(item)">
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.deleteStatus="{ item }">
          <v-btn title="Откатить статус" icon dark class="red"
            @click="deleteStatus(item)"><v-icon>mdi-arrow-u-left-bottom</v-icon></v-btn>
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