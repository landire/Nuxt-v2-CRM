<template>
  <v-container>
    <Coverage />
  </v-container>
</template>

<script>
import Coverage from '~/components/OrganizerComponents/Coverage/Coverage.vue'

export default {
  middleware: 'POrganaizer_Coverage',
  components: { Coverage },
  head: {
    title: 'Real Web - Отсутствует покрытие',
  }
}
</script>