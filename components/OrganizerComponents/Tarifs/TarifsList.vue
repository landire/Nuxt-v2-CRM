<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <v-data-table :search="tarif" :custom-filter="filterTarif" :loading="apolloLoading"
        :loading-text="'Идет загрузка данных...'" :headers="titles" :items="tarifs" class="elevation-1"
        hide-default-footer :page.sync="page" :items-per-page="itemsPerPage" @page-count="pageCount = $event">
        <template v-slot:top>
          <v-container>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-text-field prepend-inner-icon="mdi-magnify" class="mt-7" v-model="tarif" label="Поиск" outlined rounded
                clearable></v-text-field>
              <v-spacer></v-spacer>
              <v-btn :disabled="loader" title="Обновить из Биллинга" height="50px" class="primary darken-1 mr-2" icon
                dark @click="update">
                <KeepAlive>
                  <v-icon v-if="!loader">mdi-autorenew</v-icon>
                  <v-icon class="loader">mdi-autorenew</v-icon>
                </KeepAlive>
              </v-btn>
            </v-toolbar>
          </v-container>
        </template>
        <template v-slot:item.checkFlag="{ item }">
          <v-simple-checkbox class="d-inline-block" color="primary darken-2" v-model="item.flagWatchUser" light
            @click="checkFlag(item)"></v-simple-checkbox>
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
import { TarifLoadFromBilling, TarifEdit } from '~/apollo/mutation/Tarif'
import { delay } from 'q'
import TarifModel from '~/model/Tarif/TarifModel'

export default {
  components: { RoutePanel },
  mixins: [TarifModel],
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      apolloLoading: true,
      loader: false,
      titles: [
        { text: '', align: 'center', value: 'checkFlag', sortable: false },
        { text: 'Название', align: 'center', value: 'name' },
        { text: 'Id Биллинга', align: 'center', value: 'billingId' },
      ],
      links: [
        { name: 'Органайзер', path: '/' },
        { name: 'Управление тарифами', path: '/tarifs' },
      ],
      tarifs: [],
      tarif: '',
    }
  },

  async mounted() {
    const { data, subscription } = await this.getTarifs()
    this.tarifs = data
    this.apolloLoading = this.$apollo.loading

    subscription((data) => {
      this.loader = false
      const idArray = this.tarifs.map(tarif => tarif.id)
      if (!idArray.includes(data.Subscription_Tarif.id)) {
        this.tarifs.push(data.Subscription_Tarif)
      }

      this.tarifs = this.tarifs.map(tarif => {
        if (tarif.id === data.Subscription_Tarif.id) {
          tarif = data.Subscription_Tarif
        }
        return tarif
      })
    })
  },

  methods: {
    filterTarif(value, search, item) {
      return search === Array.prototype.slice.call(item.name, 0, search.length).join('')
        || search === Array.prototype.slice.call(item.billingId, 0, search.length).join('')
    },
    async update() {
      delay(this.loader = true, 5000).then(() => this.loader = false);
      this.apolloMutation(TarifLoadFromBilling)
    },
    async checkFlag(item) {
      this.apolloMutation(TarifEdit, {
        param: {
          flagWatchUser: item.flagWatchUser
        },
        idList: [item.id]
      });
    }
  },
}
</script>