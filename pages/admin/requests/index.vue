<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <RequestsList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RequestsList from '~/components/OrganizerComponents/Admin/Requests/RequestsList.vue'

export default {
  middleware: 'Admin',
  components: { RequestsList },
  head: {
    title: 'Real Web - Заявки',
  }
}
</script>