import { UserRoleEdit, UserRoleRegistration, UserRoleDelete } from '~/apollo/mutation/UserRole'
import { UserEdit } from '~/apollo/mutation/User'
import IdUserModel from '~/model/User/IdUserModel'
import UserRoleModel from '~/model/UserRole/UserRoleModel'
import RolesModel from '~/model/Role/RolesModel'

export default {
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