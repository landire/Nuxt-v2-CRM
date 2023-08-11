<template>
  <v-container>
    <BagReportWorker />
  </v-container>
</template>

<script>
import BagReportWorker from '~/components/OrganizerComponents/BagReports/BagReportWorker/BagReportWorker.vue'

export default {
  middleware: 'BagReportWorker',
  components: { BagReportWorker },
  head: {
    title: 'Real Web - Отчеты в работе'
  },
}
</script>