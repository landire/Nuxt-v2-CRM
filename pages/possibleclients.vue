<template>
  <v-container>
    <PossibleClientsList />
  </v-container>
</template>

<script>
import PossibleClientsList from '~/components/OrganizerComponents/PossibleClients/PossibleClientsList.vue'

export default {
  middleware: 'POrganaizer_MabyClient',
  components: { PossibleClientsList },
  head: {
    title: 'Real Web - Возможные клиенты',
  }
}
</script>