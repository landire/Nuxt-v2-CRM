<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <BagReportsList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BagReportsList from '~/components/OrganizerComponents/BagReports/BagReports/BagReportsList.vue'

export default {
  middleware: 'BagReportAdmin',
  components: { BagReportsList },
  head: {
    title: 'Real Web - Отчеты об ошибках',
  }
}
</script>