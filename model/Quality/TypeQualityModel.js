import apollo from '~/mixins/apollo'
import { QualityControlSelectFromType } from '~/apollo/query/QualityControl'

export default {
  mixins: [apollo],
  methods: {
    async getQualityFromType(qualityType = '', statusList = [true]) {
      const { query, obs } = this.fetchData(
        QualityControlSelectFromType, {
        param: {
          id: true,
          name: true,
          status: true,
          type: true,
        },
        typeList: [qualityType],
        statusList: statusList
      })

      const { data } = await query

      return {
        data: data.QualityControl_SelectFromType.res,
        obs
      }
    }
  }
}