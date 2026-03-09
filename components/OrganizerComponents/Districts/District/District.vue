<template>
  <div>
    <RoutePanel :link-list="links" />
    <div class="d-block justify-center flex-column ma-3" v-for="dis in district" :key="dis.id">
      <fieldset class="box-container text-center">
        <span class="text-h5 pa-5">Информация о районе</span>
        <v-text-field class="mr-3 ml-3 mt-5" v-model="dis.name" label="Название" outlined disabled></v-text-field>

      </fieldset>
      <fieldset class="box-container text-center mt-5">
        <span class="text-h5 pa-5">Списки домов</span>

        <v-row class="ma-2" justify="center">
          <v-col cols="6">
            <v-data-table :loading-text="'Идет загрузка данных...'" :headers="currHousesTitles"
              :items="updatedCurrHouses" class="elevation-1" hide-default-footer :page.sync="currPage"
              :items-per-page="currItemsPerPage" @page-count="currPageCount = $event">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-row>
                    <v-col>
                      <v-toolbar-title>Список домов района: {{ dis.name }}</v-toolbar-title>
                    </v-col>
                  </v-row>
                </v-toolbar>
              </template>
              <template v-slot:item.remove="{ item }">
                <v-btn class="red" icon dark @click="removeHouse(item)"><v-icon>mdi-delete</v-icon></v-btn>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="currPage" :length="currPageCount"></v-pagination>
            </div>
          </v-col>

          <v-col cols="6">
            <v-data-table :loading="apolloLoading" :search="searchAllHouses" :loading-text="'Идет загрузка данных...'"
              :headers="allHousesTitles" :items="updatedAllHouses" class="elevation-1" hide-default-footer
              :page.sync="allPage" :items-per-page="allItemsPerPage" @page-count="allPageCount = $event">
              <template v-slot:top>
                <v-container>
                  <v-toolbar flat>
                    <v-text-field label="Поиск по названию" prepend-inner-icon="mdi-magnify" class="mt-9"
                      v-model="searchAllHouses" outlined rounded clearable></v-text-field>
                  </v-toolbar>
                </v-container>
              </template>
              <template v-slot:item.add="{ item }">
                <v-btn class="primary" dark icon @click="addHouse(item)"><v-icon>mdi-plus</v-icon></v-btn>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="allPage" :length="allPageCount"></v-pagination>
            </div>
          </v-col>
        </v-row>
      </fieldset>
    </div>
  </div>
</template>

<script>
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'
import { delay } from 'q'
import { DistrictsLoadHousesFromBilling } from '~/apollo/query/Districts'
import { SubscriptionDistrictsBilling } from '~/apollo/subscription/Districts'
import { DistrictsEdit } from '~/apollo/mutation/Districts'
import IdDistrictModel from '~/model/District/IdDistrictModel'

export default {
  components: { RoutePanel },
  mixins: [IdDistrictModel],
  data() {
    return {
      currPage: 1,
      currPageCount: 0,
      currItemsPerPage: 10,
      allPage: 1,
      allPageCount: 0,
      allItemsPerPage: 10,
      apolloLoading: true,
      searchAllHouses: "",
      district: [],
      apolloLoading: true,
      currHousesTitles: [
        { text: "Название", align: "center", value: "house" },
        { text: "", align: "center", value: "remove", sortable: false },
      ],
      allHousesTitles: [
        { text: "Название", align: "center", value: "fullName" },
        { text: "", align: "center", value: "add", sortable: false }
      ],
      links: [
        { name: "Органайзер", path: "/" },
        { name: "Районы", path: "/districts" },
        { name: "Район", path: this.$route.path },
      ],
      allHouses: [],
      housesList: []
    };
  },

  async mounted() {
    const district = await this.getDistrictFromId(this.$route.params.id)
    this.district = district.data
    this.housesList = district.data.map(dis => dis.housesList).flat()

    district.subscription((data) => {
      this.district = this.district.map(dis => {
        dis = data.Subscription_Districts

        return dis
      })

      this.housesList = this.district.map(dis => dis.housesList).flat()
    })

    delay(this.$apollo.addSmartSubscription('houses', {
      query: SubscriptionDistrictsBilling,
      result({ data }) {
        this.allHouses = data.Subscription_DistrictsBilling;
      }
    }), 1000).then(() => {
      this.apolloQuery(DistrictsLoadHousesFromBilling).then(data => {
        this.apolloLoading = data.loading
      })
    })
  },

  computed: {
    updatedCurrHouses() {
      let housesList = [];
      this.district = this.district.map(dis => {
        housesList = dis.housesList.map(house => {
          return { house };
        });
        return dis;
      });
      return housesList;
    },
    updatedAllHouses() {
      this.allHouses = this.allHouses.map(house => {
        house.fullName = `${house.country}, ${house.region}, ${house.city}, ${house.street}`;
        return house;
      });
      return this.allHouses.filter(house => {
        return house.Districts === "Не закреплен";
      });
    }
  },
  methods: {
    async removeHouse(item) {
      this.housesList = this.housesList.filter(house => {
        if (house !== item.house) {
          return house;
        }
      });
      this.apolloMutation(DistrictsEdit, {
        param: {
          housesList: this.housesList
        },
        idList: [this.$route.params.id]
      });
      const splitedArray = item.house.split(", ");
      this.allHouses.unshift({
        country: splitedArray[0],
        region: splitedArray[1],
        city: splitedArray[2],
        street: splitedArray[3],
        Districts: "Не закреплен",
        fullName: item.house
      });
    },
    async addHouse(item) {
      this.housesList.push(item.fullName);
      this.apolloMutation(DistrictsEdit, {
        param: {
          housesList: this.housesList
        },
        idList: [this.$route.params.id]
      });
      this.allHouses = this.allHouses.filter(house => {
        if (item.fullName !== house.fullName) {
          return house;
        }
      });
    },
  },
}
</script>