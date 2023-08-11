<template>
  <v-container>
    <Control />
  </v-container>
</template>

<script>
import Control from '~/components/OrganizerComponents/Control/Control.vue'


export default {
  middleware: 'RequestUser',
  components: { Control },
  head: {
    title: 'Real Web - Контроль заявок'
  },
}
</script>