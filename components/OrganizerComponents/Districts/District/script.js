import { delay } from 'q'
import { DistrictsLoadHousesFromBilling } from '~/apollo/query/Districts'
import { SubscriptionDistrictsBilling } from '~/apollo/subscription/Districts'
import { DistrictsEdit } from '~/apollo/mutation/Districts'
import IdDistrictModel from '~/model/District/IdDistrictModel'

export default {
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