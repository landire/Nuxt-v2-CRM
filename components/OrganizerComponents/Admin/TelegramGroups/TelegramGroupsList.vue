<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :items="tgGroups" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">

        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Список телеграмм групп</v-toolbar-title>
            </v-toolbar>
          </v-container>
        </template>

        <template v-slot:item.title="{ item }">
          <NuxtLink class="item-link" :to="`/admin/telegram/${item.id}`">{{ item.name }}</NuxtLink>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import TelegramGroupModel from '~/model/TelegramGroup/TelegramGroupModel'

export default {
  components: { RoutePanel },
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
</script>