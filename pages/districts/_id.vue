<template>
  <v-container>
    <District />
  </v-container>
</template>

<script>
import District from '~/components/OrganizerComponents/Districts/District/District.vue'

export default {
  middleware: 'DistrictsAdmin',
  components: { District },
  head: {
    title: 'Real Web - Район',
  }
}
</script>