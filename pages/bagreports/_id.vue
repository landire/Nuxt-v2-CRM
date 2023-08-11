<template>
  <v-container>
    <BagReport />
  </v-container>
</template>

<script>
import BagReport from '~/components/OrganizerComponents/BagReports/BagReport/BagReport.vue'

export default {
  middleware: 'BagReportAdmin',
  components: { BagReport },
  head: {
    title: 'Real Web - Отчет об ошибке',
  }
}
</script>