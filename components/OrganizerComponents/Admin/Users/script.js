import UsersModel from '~/model/User/UsersModel'

export default {
  mixins: [UsersModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      userTitles: [
        { text: 'Имя пользователя', align: 'center', value: 'title' },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Кабинет администратора', path: '/admin' },
        { name: 'Пользователи', path: '/admin/users' },
      ],
      users: []
    }
  },

  async mounted() {
    const { data, subscription } = await this.getUsers()
    this.users = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
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
}