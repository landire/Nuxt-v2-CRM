<template>
  <v-container>
    <Request />
  </v-container>
</template>

<script>
import Request from '~/components/OrganizerComponents/Admin/Request/Request.vue'

export default {
  middleware: 'Admin',
  components: { Request },
  head: {
    title: 'Real Web - Заявка',
  }
}
</script>