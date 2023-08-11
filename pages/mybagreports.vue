<template>
  <v-container>
    <MyBagReportsList />
  </v-container>
</template>

<script>
import MyBagReportsList from '~/components/OrganizerComponents/BagReports/MyBagReports/MyBagReportsList.vue'

export default {
  middleware: 'BagReportUser',
  components: { MyBagReportsList },
  head: {
    title: 'Real Web - Мои отчеты об ошибках'
  },
}
</script>