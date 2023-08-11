<template>
  <v-container>
    <TarifsList />
  </v-container>
</template>

<script>
import TarifsList from '~/components/OrganizerComponents/Tarifs/TarifsList.vue'

export default {
  middleware: 'TarifAdmin',
  components: { TarifsList },
  head: {
    title: 'Real Web - Управление тарифами',
  }
}
</script>