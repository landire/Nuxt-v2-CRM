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
          <OButtonMFI :ufms-errors="ufmsData" v-if="this.$store.state.permissionList.includes('POrganaizer_MFIFiles')" />
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
import script from './script'

export default {
  mixins: [script],
  components: { DownloadRNKB, OButtonRequestManager, OButtonCreateAbonList, OButtonTechAccept, OButtonConnection, OButtonAdmin, OButtonMFI, OButtonPayment, OButtonBagReport },
}
</script>
