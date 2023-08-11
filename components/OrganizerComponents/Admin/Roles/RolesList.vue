<template>
  <v-container style="background-color: #FFFFFF;">
    <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles" :items="roles"
      class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
      @page-count="pageCount = $event">
      <template v-slot:top>
        <v-container>
          <v-toolbar flat>
            <v-toolbar-title>Список ролей</v-toolbar-title>
            <v-spacer></v-spacer>
            <RoleCreate class="mr-3 mt-1" />
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
                    <v-text-field v-model="editedRole.name" label="Роль"></v-text-field>
                    <v-text-field v-model="editedRole.coment" label="Комментарий"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn color="primary darken-1" @click="save">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="roleDeleteDialog" max-width="300px">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <span>Вы уверены ?</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark class="red" @click="acceptDeleteRole">Да</v-btn>
              <v-spacer></v-spacer>
              <v-btn dark class="primary" @click="declineDeleteRole">Нет</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.editRole="{ item }">
        <v-btn title="Редактировать Роль" icon dark class="primary"
          @click="editRole(item)"><v-icon>mdi-pencil</v-icon></v-btn>
      </template>
      <template v-slot:item.deleteRole="{ item }">
        <v-btn title="Удалить Роль" icon dark class="red" @click="deleteRole(item)"><v-icon>mdi-delete</v-icon></v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import script from './script'
import RoleCreate from '~/components/ButtonComponents/Role/RoleCreate.vue'

export default {
  mixins: [script],
  components: { RoleCreate },
}
</script>