import TelegramGroupModel from '~/model/TelegramGroup/TelegramGroupModel'

export default {
  mixins: [TelegramGroupModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      titles: [
        { text: "Название", align: "center", value: "title" },
        { text: "Комментарий", align: "center", value: "coment" },
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Кабинет администратора", path: "/admin" },
        { name: "Телеграмм группы", path: "/admin/telegram" },
      ],
      tgGroups: [],
      apolloLoading: true,
    };
  },
  async mounted() {
    const { data, subscription } = await this.getTelegramGroup()
    this.tgGroups = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      const idArray = this.tgGroups.map(tg => tg.id)

      if (!idArray.includes(data.Subscription_TelegramGroop.id)) {
        this.tgGroups.push(data.Subscription_TelegramGroop)
      } else if (idArray.includes(data.Subscription_TelegramGroop.id)) {
        this.tgGroups = this.tgGroups.map(tg => {
          if (tg.id === data.Subscription_TelegramGroop.id) {
            tg = data.Subscription_TelegramGroop
          }

          return tg
        })
      }
    })
  }
}