<template>
  <v-container fill-height fluid>
    <Organizer />
  </v-container>
</template>

<script>
import Organizer from '~/components/HomeComponents/Organizer/Organizer.vue'

export default {
  middleware: 'authenticated',
  components: { Organizer },
  layout: 'organizer',
  head: {
    title: 'Real Web - Органайзер'
  },
}
</script>
