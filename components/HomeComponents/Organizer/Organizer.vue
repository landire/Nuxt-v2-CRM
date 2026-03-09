<template>
  <v-container>
    <v-row justify="center">
      <v-col class="text-center" cols="12">
        <KeepAlive>
          <OButtonCreateAbonList v-if="this.$store.state.permissionList.includes('POrganaizer_CreateAbon')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonTechAccept v-if="this.$store.state.permissionList.includes('POrganaizer_TexAccept')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonRequestManager v-if="this.$store.state.permissionList.includes('POrganaizer_ManagerRequest')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonMFI :ufms-errors="ufmsData"
            v-if="this.$store.state.permissionList.includes('POrganaizer_MFIFiles')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonPayment v-if="this.$store.state.permissionList.includes('POrganaizer_Report')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonAdmin :districts-errors="districtsData" v-if="this.$store.state.permissionList.includes('Admin')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonConnection v-if="this.$store.state.permissionList.includes('POrganaizer_Connect')" />
        </KeepAlive>

        <KeepAlive>
          <OButtonBagReport :done-reports="doneBagReport" :work-reports="workBagReport" :all-reports="allBagReport"
            v-if="this.$store.state.permissionList.includes('POrganaizer_BagReport')" />
        </KeepAlive>

        <DownloadRNKB />
      </v-col>

      <v-col class="text-center" cols="12">
        <KeepAlive>
          <NuxtLink v-if="this.$store.state.permissionList.includes('QualityControlUser')" no-prefetch
            class="ma-5 v-btn v-btn--is-elevated v-btn--has-bg theme--light elevation-6 v-size--default"
            style="height:170px; width:260px;" to="/qualitycontrol">Контроль качества</NuxtLink>
        </KeepAlive>

        <KeepAlive>
          <NuxtLink v-if="this.$store.state.permissionList.includes('POrganaizer_Coverage')" no-prefetch
            class="ma-5 v-btn v-btn--is-elevated v-btn--has-bg theme--light elevation-6 v-size--default"
            style="height:170px; width:260px;" to="/coverage">Отсутствует покрытие</NuxtLink>
        </KeepAlive>

        <KeepAlive>
          <NuxtLink v-if="this.$store.state.permissionList.includes('POrganaizer_MabyClient')" no-prefetch
            class="ma-5 v-btn v-btn--is-elevated v-btn--has-bg theme--light elevation-6 v-size--default"
            style="height:170px; width:260px;" to="/possibleclients">Возможные клиенты</NuxtLink>
        </KeepAlive>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import OButtonCreateAbonList from '~/components/OrganizerButtonComponents/OButtonCreateAbonList.vue'
import OButtonTechAccept from '~/components/OrganizerButtonComponents/OButtonTechAccept.vue'
import OButtonConnection from '~/components/OrganizerButtonComponents/OButtonConnection.vue'
import OButtonAdmin from '~/components/OrganizerButtonComponents/OButtonAdmin.vue'
import OButtonRequestManager from '~/components/OrganizerButtonComponents/OButtonRequestManager.vue'
import OButtonMFI from '~/components/OrganizerButtonComponents/OButtonMFI.vue'
import OButtonPayment from '~/components/OrganizerButtonComponents/OButtonPayment.vue'
import OButtonBagReport from '~/components/OrganizerButtonComponents/OButtonBagReport.vue'
import DownloadRNKB from '~/components/ButtonComponents/DownloadRNKB/DownloadRNKB.vue'
import { SubscriptionEmiter } from '~/apollo/subscription/Emitter'
import apollo from '~/mixins/apollo'
import { EmitersGetEmiters } from '~/apollo/query/Emitter'

export default {
  components: { DownloadRNKB, OButtonRequestManager, OButtonCreateAbonList, OButtonTechAccept, OButtonConnection, OButtonAdmin, OButtonMFI, OButtonPayment, OButtonBagReport },
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
</script>
