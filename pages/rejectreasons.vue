<template>
  <v-container>
    <RejectReasonsList />
  </v-container>
</template>

<script>
import RejectReasonsList from '~/components/OrganizerComponents/RejectReasons/RejectReasonsList.vue'


export default {
  middleware: 'QualityControlAdmin',
  components: { RejectReasonsList },
  head: {
    title: 'Real Web - Причины отказа'
  },
}
</script>