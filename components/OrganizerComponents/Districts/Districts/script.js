import DistrictsModel from '~/model/District/DistrictsModel'

export default {
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