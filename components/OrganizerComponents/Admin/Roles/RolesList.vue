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
import RoleCreate from '~/components/ButtonComponents/Role/RoleCreate.vue'
import { RoleEdit, RoleDelete } from '~/apollo/mutation/Role'
import RolesModel from '~/model/Role/RolesModel'

export default {
  components: { RoleCreate },
  mixins: [RolesModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      dialog: false,
      roleDeleteDialog: false,
      apolloLoading: true,
      titles: [
        { text: 'Роль', align: 'center', value: 'name' },
        { text: 'Комментарий', align: 'center', value: 'coment' },
        { text: '', align: 'center', value: 'editRole', sortable: false },
        { text: '', align: 'center', value: 'deleteRole', sortable: false }
      ],
      roles: [],
      editedRole: {},
    }
  },

  async mounted() {
    const { data, subscription } = await this.getRole()
    this.roles = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      if (data.Subscription_Role.name !== 'Удален') {
        const idArray = this.roles.map(role => role.id)

        if (!idArray.includes(data.Subscription_Role.id)) {
          this.roles.push(data.Subscription_Role)
        }

        if (idArray.includes(data.Subscription_Role.id)) {
          this.roles = this.roles.map(role => {
            if (role.id === data.Subscription_Role.id) {
              role = data.Subscription_Role
            }

            return role
          })
        }
      } else {
        this.roles = this.roles.map(role => {
          if (role.id === data.Subscription_Role.id) {
            role = data.Subscription_Role
          }

          return role
        })

        this.roles = this.roles.filter(role => role.id !== data.Subscription_Role.id)
      }
    })
  },

  methods: {

    async editRole(item) {
      this.editedRole = item
      this.dialog = true
    },

    async close() {
      this.dialog = false
    },

    async save() {
      this.apolloMutation(RoleEdit, {
        idList: [this.editedRole.id],
        param: {
          name: this.editedRole.name,
          coment: this.editedRole.coment
        }
      })
      this.close()
    },

    async deleteRole(item) {
      if (item.id !== undefined) {
        this.editedRole = item
        this.roleDeleteDialog = true
      }
    },

    async declineDeleteRole() {
      this.roleDeleteDialog = false
    },

    async acceptDeleteRole() {
      this.apolloMutation(RoleDelete, {
        idList: [this.editedRole.id]
      })
      this.declineDeleteRole()
    }
  },
}
</script>