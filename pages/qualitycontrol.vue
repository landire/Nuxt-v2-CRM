<template>
  <v-container>
    <QualityControlsList />
  </v-container>
</template>

<script>
import QualityControlsList from '~/components/OrganizerComponents/QualityControls/QualityControlsList.vue'

export default {
  middleware: 'QualityControlUser',
  components: { QualityControlsList },
  head: {
    title: 'Real Web - Контроль качества',
  }
}
</script>