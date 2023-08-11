<template>
  <div>
    <RoutePanel :link-list="links" />
    <div class="d-flex justify-center flex-column ma-3" v-for="group in compTgGroup" :key="group.id">
      <fieldset class="box-container text-center">
        <span class="text-h5 pa-5">Информация о группе</span>
        <v-container>
          <v-text-field disabled label="Название" v-model="group.name" outlined></v-text-field>
          <v-text-field disabled label="Комментарий" v-model="group.coment" outlined></v-text-field>
        </v-container>
      </fieldset>

      <fieldset class="box-container text-center mt-5">
        <span class="text-h5 pa-5">Управление пользователями</span>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="userTitles"
                :items="group.userList" class="elevation-1" hide-default-footer :page.sync="page"
                :items-per-page="itemsPerPage" @page-count="pageCount = $event">
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-toolbar-title>Пользователи в группе</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </template>
                <template v-slot:item.delUser="{ item }">
                  <v-btn class="red" dark title="Удалить из группы" icon @click="delUser(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <div class="text-center pt-2">
                <v-pagination v-model="page" :length="pageCount"></v-pagination>
              </div>
            </v-col>

            <v-col cols="6">
              <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="allUserTitles"
                :items="allUserFilter" class="elevation-1" hide-default-footer :page.sync="pageAll"
                :items-per-page="itemsPerPageAll" @page-count="pageCountAll = $event">
                <template v-slot:top>
                  <v-container>
                    <v-toolbar flat>
                      <v-toolbar-title>Все пользователи</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-checkbox class="ml-2 mt-7 mr-2" label="Указан ID" v-model="isHaveID"></v-checkbox>
                    </v-toolbar>
                  </v-container>
                </template>
                <template v-slot:item.addUser="{ item }">
                  <v-btn :disabled="group.userIdList.includes(item.id) || item.idTelegram === null" class="primary" dark
                    title="Добавить в группу" icon @click="addUser(item)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
              <div class="text-center pt-2">
                <v-pagination v-model="pageAll" :length="pageCountAll"></v-pagination>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </fieldset>
    </div>
  </div>
</template>

<script>
import script from './script'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'

export default {
  mixins: [script],
  components: { RoutePanel },
}
</script>