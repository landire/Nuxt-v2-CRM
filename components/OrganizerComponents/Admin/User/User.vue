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

                  <v-btn title="Удалить ЮзерРоль" dark class="red ml-2 mr-2" icon
                    :disabled="user.userRole === undefined"
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
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import { UserRoleEdit, UserRoleRegistration, UserRoleDelete } from '~/apollo/mutation/UserRole'
import { UserEdit } from '~/apollo/mutation/User'
import IdUserModel from '~/model/User/IdUserModel'
import UserRoleModel from '~/model/UserRole/UserRoleModel'
import RolesModel from '~/model/Role/RolesModel'

export default {
  components: { RoutePanel },
  middleware: "Admin",
  mixins: [IdUserModel, UserRoleModel, RolesModel],
  head: {
    title: "Real Web - Пользователь",
  },
  data() {
    return {
      user: [],
      userRolesId: [],
      roleIdList: [],
      roles: [],
      rolesName: [],
      userRoles: [],
      userRoleDeleteDialog: false,
      userRoleDel: [],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Кабинет администратора', path: '/admin' },
        { name: 'Пользователи', path: '/admin/users' },
        { name: 'Пользователь', path: this.$route.path },
      ],
    };
  },
  async mounted() {
    const user = await this.getUsers(this.$route.params.id)
    this.user = user.data

    user.subscription((data) => {
      this.user = this.user.map(user => {
        user = data.Subscription_User

        return user
      })
    })

    const userRole = await this.getUserRole([this.$route.params.id])
    this.userRoles = userRole.data

    userRole.subscription((data) => {
      this.user = this.user.map(user => {
        if (data.Subscription_UserRole.name !== 'Удален') {
          user.userRole = data.Subscription_UserRole
          user.userRoleId = data.Subscription_UserRole.id
        }
        if (data.Subscription_UserRole.name === 'Удален') {
          user.userRole = undefined
          user.userRoleId = undefined
          user.roleNameList = undefined
        }

        return user
      })
    })

    const roles = await this.getRole()
    this.roles = roles.data
    this.rolesName = roles.data.map(role => role.name)

    roles.subscription((data) => {
      if (data.Subscription_Role.name !== 'Удален') {
        const idArray = this.roles.map(role => role.id)

        if (!idArray.includes(data.Subscription_Role.id)) {
          this.roles.push(data.Subscription_Role)
          this.rolesName.push(data.Subscription_Role.name)
        }
        if (idArray.includes(data.Subscription_Role.id)) {
          this.roles = this.roles.map(role => {
            if (role.id === data.Subscription_Role.id) {
              role = data.Subscription_Role
            }

            return role
          })

          this.rolesName = this.roles.map(role => role.name)
        }
      } else {
        this.roles = this.roles.map(role => {
          if (role.id === data.Subscription_Role.id) {
            role = data.Subscription_Role
          }

          return role
        })

        this.roles = this.roles.filter(role => role.id !== data.Subscription_Role.id)
        this.rolesName = this.roles.map(role => role.name)
      }
    })

    this.user = this.user.map(user => {
      user.roleNameList = []

      this.userRoles.forEach(userRole => {
        if (userRole.userId === user.id) {
          user.userRole = userRole
          user.userRoleId = userRole.id
        }
      })

      if (user.userRole !== undefined) {
        this.roles.forEach(role => {
          if (user.userRole.RoleList.includes(role.id)) {
            user.roleNameList.push(role.name)
          }
        })
      }

      return user
    })
  },
  methods: {
    async changeRole(user) {
      let roleIdList = [];
      this.roles.forEach(role => {
        user.roleNameList.forEach(rlName => {
          if (role.name === rlName) {
            roleIdList.push(role.id);
          }
        });
      });
      this.apolloMutation(UserRoleEdit, {
        idList: [user.userRole.id],
        param: {
          RoleList: roleIdList
        }
      });
    },
    async addUserRole(user) {
      this.apolloMutation(UserRoleRegistration, {
        param: {
          userId: user.id,
          name: user.name
        }
      });
    },
    async deleteUserRole(user) {
      this.userRoleDel = [user.userRole.id];
      this.userRoleDeleteDialog = true;
    },
    async declineDeleteUserRole() {
      this.userRoleDeleteDialog = false;
    },
    async acceptDeleteUserRole() {
      this.apolloMutation(UserRoleDelete, {
        idList: this.userRoleDel
      });
      this.userRoleDeleteDialog = false;
    },
    async saveUserData(user) {
      this.apolloMutation(UserEdit, {
        param: {
          name: user.name,
          idTelegram: user.idTelegram
        },
        idList: [user.id]
      });
    },
  },
}
</script>