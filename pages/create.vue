<template>
  <v-container>
    <CreateRequestsList />
  </v-container>
</template>

<script>
import CreateRequestsList from '~/components/OrganizerComponents/CreateRequests/CreateRequestsList.vue'


export default {
  middleware: 'CreateAbonUser',
  components: { CreateRequestsList },
  head: {
    title: 'Real Web - Создание абонента'
  },
}
</script>