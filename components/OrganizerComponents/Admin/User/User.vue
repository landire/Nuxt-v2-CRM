<template>
  <div>
    <RoutePanel :link-list="links" />
    <div class="d-block justify-center flex-column ma-3" v-for="user in user" :key="user.id">
      <fieldset class="box-container text-center">
        <span class="text-h5 pa-5">Пользовательские данные</span>

        <v-text-field class="mr-3 ml-3 mt-5" v-model="user.name" label="Имя" outlined></v-text-field>
        <v-text-field class="mr-3 ml-3" v-model="user.idTelegram" label="ID Телеграмма" outlined></v-text-field>
        <v-container class="text-end">
          <v-btn title="Подтвердить изменения" class="success" icon dark large @click="saveUserData(user)">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-container>
      </fieldset>

      <fieldset class="box-container align-center mt-5">
        <span class="text-h5 pa-5">Управление доступом</span>

        <v-container>
          <v-row>
            <v-col cols="10">
              <v-combobox class="mt-2 ml-3" v-model="user.roleNameList" :items="rolesName" label="Роли"
                :disabled="user.userRole === undefined" multiple chips outlined @change="changeRole(user)"></v-combobox>
            </v-col>
            <v-col cols="2">
              <fieldset class="box-container justify-center align-center mr-3">
                <legend class="v-label theme--light"
                  style="font-size: 13px; padding-left: 4px; padding-right: 4px; margin-left: 6px;">ЮзерРоль</legend>
                <div class="mb-2">
                  <v-btn title="Создать ЮзерРоль" icon dark class="green ml-2 mr-2"
                    :disabled="user.userRole !== undefined" @click="addUserRole(user)"><v-icon>mdi-plus</v-icon></v-btn>

                  <v-btn title="Удалить ЮзерРоль" dark class="red ml-2 mr-2" icon :disabled="user.userRole === undefined"
                    @click="deleteUserRole(user)"><v-icon>mdi-delete</v-icon></v-btn>
                </div>
              </fieldset>
            </v-col>
          </v-row>
        </v-container>


      </fieldset>

      <template>
        <v-dialog v-model="userRoleDeleteDialog" max-width="300px">
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <span>Вы уверены ?</span>
              <v-spacer></v-spacer>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark class="red" @click="acceptDeleteUserRole">Да</v-btn>
              <v-spacer></v-spacer>
              <v-btn dark class="primary" @click="declineDeleteUserRole">Нет</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
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