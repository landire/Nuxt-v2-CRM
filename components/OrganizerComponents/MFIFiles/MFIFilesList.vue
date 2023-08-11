<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles" :search="search"
        :custom-filter="filterAbons" :items="filteredAbons" class="elevation-1" hide-default-footer :page.sync="page"
        :items-per-page="itemsPerPage" @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-text-field prepend-inner-icon="mdi-magnify" label="Поиск" v-model="search" class="mt-7" outlined rounded
                clearable></v-text-field>
              <v-select class="mt-7 ml-3 mr-3" outlined prepend-inner-icon="mdi-magnify" label="Поиск по ошибкам"
                :items="errors" v-model="error" clearable rounded></v-select>
              <v-btn :disabled="!$store.state.permissionList.includes('MFIFilesAdmin') || loader === true"
                title="Обновить список ошибок" class="primary ml-3 mr-2" icon dark @click="update">
                <KeepAlive>
                  <v-icon v-if="!loader">mdi-autorenew</v-icon>
                  <v-icon class="loader">mdi-autorenew</v-icon>
                </KeepAlive>
              </v-btn>
            </v-toolbar>
          </v-container>

          <v-dialog v-model="editAbonDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Редактирование</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-text-field v-model="editedAbon.coment" label="Комментарий" outlined></v-text-field>
                </v-container>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn title="Подтвердить изменения" @click="acceptEditAbon" icon large dark class="success">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>

          <v-dialog v-model="errorsDialog" max-width="600px">
            <v-card>
              <v-card-title class="justify-center">
                <span>Список ошибок</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <li v-for="(error, i) in editedAbon.abonErrors" :key="i">
                    <span>{{ error }}</span>
                  </li>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <KeepAlive v-if="editedAbon.auswais !== undefined">
            <v-dialog v-model="passDataDialog" max-width="600px">
              <v-card>
                <v-card-title class="justify-center">
                  <span>Пасспортные данные</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-text-field label="Кем выдан" v-model="editedAbon.auswais.kem" disabled></v-text-field>
                    <v-text-field label="От" v-model="editedAbon.auswais.ot" disabled></v-text-field>
                    <v-text-field label="Серия" v-model="editedAbon.auswais.seria" disabled></v-text-field>
                    <v-text-field label="Номер" v-model="editedAbon.auswais.number" disabled></v-text-field>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>
          </KeepAlive>
        </template>

        <template v-slot:item.editAbon="{ item }">
          <v-btn :disabled="!$store.state.permissionList.includes('MFIFilesAdmin')" title="Редактировать Абонента" icon
            dark class="primary" @click="editAbon(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        </template>
        <template v-slot:item.errorsList="{ item }">
          <v-btn title="Список ошибок" icon dark class="error"
            @click="errorList(item)"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
        </template>
        <template v-slot:item.passData="{ item }">
          <v-btn title="Пасспортные данные" icon class="black" dark
            @click="passData(item)"><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
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