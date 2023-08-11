import { SubscriptionEmiter } from '~/apollo/subscription/Emitter'
import apollo from '~/mixins/apollo'
import { EmitersGetEmiters } from '~/apollo/query/Emitter'

export default {
  mixins: [apollo],
  data() {
    return {
      ufmsData: null,
      districtsData: null,
      doneBagReport: null,
      workBagReport: null,
      allBagReport: null,
    }
  },

  beforeMount() {
    this.$apollo.addSmartSubscription('emitter', {
      query: SubscriptionEmiter,
      result({ data }) {
        if (data.Subscription_Emiter.emitData.UFMSErrorCount !== undefined) {
          this.ufmsData = data.Subscription_Emiter.emitData.UFMSErrorCount
        }

        if (data.Subscription_Emiter.emitData.DistrictsErrorCount !== undefined) {
          this.districtsData = data.Subscription_Emiter.emitData.DistrictsErrorCount
        }

        if (data.Subscription_Emiter.emitData.BagreportDone !== undefined) {
          this.doneBagReport = data.Subscription_Emiter.emitData.BagreportDone
        }

        if (data.Subscription_Emiter.emitData.BagreportWork !== undefined) {
          this.workBagReport = data.Subscription_Emiter.emitData.BagreportWork
        }

        if (data.Subscription_Emiter.emitData.BagreportAll !== undefined) {
          this.allBagReport = data.Subscription_Emiter.emitData.BagreportAll
        }
      }
    })

    setTimeout(() => {
      if (this.$store.state.permissionList.includes('UFMSAdmin')) {
        this.apolloQuery(EmitersGetEmiters, {
          emitNameList: ['Emit_UFMSErrorCount']
        })
      }

      if (this.$store.state.permissionList.includes('DistrictsAdmin')) {
        this.apolloQuery(EmitersGetEmiters, {
          emitNameList: ['Emit_DistrictsErrorCount']
        })
      }

      if (this.$store.state.permissionList.includes('BagReportUser')) {
        this.apolloQuery(EmitersGetEmiters, {
          emitNameList: ['Emit_BagreportDone']
        })
      }
    }, 2000)
  },
}