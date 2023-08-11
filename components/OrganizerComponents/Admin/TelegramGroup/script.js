import { TelegramGroopEdit } from '~/apollo/mutation/TelegramGroup'
import IdTelegramGroupModel from '~/model/TelegramGroup/IdTelegramGroupModel'
import UsersModel from '~/model/User/UsersModel'

export default {
  mixins: [IdTelegramGroupModel, UsersModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      pageAll: 1,
      pageCountAll: 0,
      itemsPerPageAll: 5,
      tgGroup: [],
      users: [],
      apolloLoading: true,
      isHaveID: false,
      selectedUser: null,
      allUserSelect: ["Есть"],
      userTitles: [
        { text: "Имя", align: "center", value: "name" },
        { text: "ID Телеграмма", align: "center", value: "idTelegram" },
        { text: "", align: "center", value: "delUser", sortable: false },
      ],
      allUserTitles: [
        { text: "Имя", align: "center", value: "name" },
        { text: "ID Телеграмма", align: "center", value: "idTelegram" },
        { text: "", align: "center", value: "addUser", sortable: false },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Кабинет администратора", path: "/admin" },
        { name: "Телеграмм группы", path: "/admin/telegram" },
        { name: "Группа", path: this.$route.path },
      ],
    };
  },
  async mounted() {
    const tgGroup = await this.getTelegramGroupFromId(this.$route.params.id)
    this.tgGroup = tgGroup.data
    this.apolloLoading = this.$apollo.loading

    tgGroup.subscription((data) => {
      this.tgGroup = this.tgGroup.map(group => {
        group = data.Subscription_TelegramGroop
        group.userList = []
        group.userIdList.forEach(userId => {
          this.users.forEach(user => {
            if (userId === user.id) {
              group.userList.push({
                id: user.id,
                name: user.name,
                idTelegram: user.idTelegram
              })
            }
          })
        })

        return group
      })
    })

    const users = await this.getUsers()
    this.users = users.data

    users.subscription((data) => {
      const idList = this.users.map(user => user.id)
      if (!idList.includes(data.Subscription_User.id)) {
        this.users.push(data.Subscription_User)
      }
      if (idList.includes(data.Subscription_User.id)) {
        this.users = this.users.map(user => {
          if (user.id === data.Subscription_User.id) {
            user = data.Subscription_User
          }

          return user
        })
      }
    })
  },
  computed: {
    compTgGroup() {
      this.tgGroup = this.tgGroup.map(group => {
        group.userList = []
        group.userIdList?.forEach(userId => {
          this.users.forEach(user => {
            if (userId === user.id) {
              group.userList.push({
                id: user.id,
                name: user.name,
                idTelegram: user.idTelegram
              })
            }
          })
        })
        
        return group
      })

      return this.tgGroup
    },

    allUserFilter() {
      return this.users.filter(user => {
        return !this.isHaveID || (user.idTelegram !== null);
      });
    }
  },
  methods: {
    async addUser(user) {
      let newIdList = [];
      this.tgGroup.forEach(group => {
        newIdList = group.userIdList;
        newIdList.push(user.id);
        group.userIdList = newIdList;
      });
      this.apolloMutation(TelegramGroopEdit, {
        param: {
          userIdList: newIdList
        },
        idList: [this.$route.params.id]
      });
    },
    async delUser(user) {
      let newIdList = [];
      this.tgGroup.forEach(group => {
        newIdList = group.userIdList.filter(id => id !== user.id);
        group.userIdList = newIdList;
      });
      this.apolloMutation(TelegramGroopEdit, {
        param: {
          userIdList: newIdList
        },
        idList: [this.$route.params.id]
      });
    }
  },
}