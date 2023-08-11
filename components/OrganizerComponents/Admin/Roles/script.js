import { RoleEdit, RoleDelete } from '~/apollo/mutation/Role'
import RolesModel from '~/model/Role/RolesModel'

export default {
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