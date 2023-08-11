<template>
  <v-container>
    <Connection />
  </v-container>
</template>

<script>
import Connection from '~/components/OrganizerComponents/Connection/Connection.vue'


export default {
  middleware: 'ConnectAdmin',
  components: { Connection },
  head: {
    title: 'Real Web - Подключение'
  },
}
</script>