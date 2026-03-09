<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :loading="apolloLoading" :loading-text="'Идет загрузка данных...'" :headers="titles"
        :items="districts" class="elevation-1" hide-default-footer :page.sync="page" :items-per-page="itemsPerPage"
        @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-toolbar-title>Список районов</v-toolbar-title>
              <v-spacer></v-spacer>
              <DistrictCreate class="mr-3 mt-1" />
            </v-toolbar>
          </v-container>
        </template>

        <template v-slot:item.title="{ item }">
          <NuxtLink class="item-link" :to="`/districts/${item.id}`">{{ item.name }}</NuxtLink>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import DistrictCreate from '~/components/ButtonComponents/District/DistrictCreate.vue'
import DistrictsModel from '~/model/District/DistrictsModel'

export default {
  components: { DistrictCreate, RoutePanel },
  mixins: [DistrictsModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      titles: [
        { text: 'Наименование района', align: 'center', value: 'title' },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Районы', path: '/districts' },
      ],
      districts: [],
    }
  },

  async mounted() {
    const { data, subscription } = await this.getDistricts()
    this.districts = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      const idArray = this.districts.map(dis => dis.id)

      if (!idArray.includes(data.Subscription_Districts._id)) {
        this.districts.push({
          id: data.Subscription_Districts._id,
          name: data.Subscription_Districts.name
        })
      } else if (idArray.includes(data.Subscription_Districts._id)) {
        this.districts = this.districts.map(dis => {
          if (dis.id === data.Subscription_Districts._id) {
            dis = {
              id: data.Subscription_Districts._id,
              name: data.Subscription_Districts.name
            }
          }

          return dis
        })
      }
    })
  },
}
</script>