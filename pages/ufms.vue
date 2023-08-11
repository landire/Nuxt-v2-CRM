<template>
  <v-container>
    <UfmsList />
  </v-container>
</template>

<script>
import UfmsList from '~/components/OrganizerComponents/Ufms/UfmsList.vue'

export default {
  middleware: 'UFMSAdmin',
  components: { UfmsList },
  head: {
    title: 'Real Web - Справочник отделений УФМС'
  },
}
</script>