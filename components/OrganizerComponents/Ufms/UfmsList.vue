<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :search="codeUfms" :custom-filter="filterCodeUfms" :loading="apolloLoading"
        :loading-text="'Идет загрузка данных...'" :headers="titles" :items="ufms" class="elevation-1" hide-default-footer
        :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Справочник отделений УФМС</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field prepend-inner-icon="mdi-magnify" class="mt-7" v-model="codeUfms" label="Поиск по коду"
                outlined rounded clearable></v-text-field>
              <v-spacer></v-spacer>
              <UfmsCreate class="mr-3 mt-1" />
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
                    <v-col cols="12">
                      <v-text-field v-model="editedUfms.name" label="Кем выдан"></v-text-field>
                      <v-text-field v-model="editedUfms.structureCod" label="Код подразделения"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-container>
                <v-card-actions class="justify-center">
                  <v-btn title="Подтвердить" class="success" icon dark large @click="save">
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </v-dialog>

          <v-dialog v-model="ufmsDeleteDialog" max-width="300px">
            <v-card>
              <v-card-title>
                <v-spacer></v-spacer>
                <span>Вы уверены ?</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark class="red" @click="acceptDeleteUfms">Да</v-btn>
                <v-spacer></v-spacer>
                <v-btn dark class="primary" @click="declineDeleteUfms">Нет</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.editUfms="{ item }">
          <v-btn title="Редактировать УФМС" icon dark class="primary"
            @click="editUfms(item)"><v-icon>mdi-pencil</v-icon></v-btn>
        </template>
        <template v-slot:item.deleteUfms="{ item }">
          <v-btn title="Удалить УФМС" icon dark class="red" @click="deleteUfms(item)"><v-icon>mdi-delete</v-icon></v-btn>
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
import UfmsCreate from '~/components/ButtonComponents/Ufms/UfmsCreate.vue'

export default {
  mixins: [script],
  components: { UfmsCreate, RoutePanel }
}
</script>