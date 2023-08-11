<template>
  <v-container>
    <MFIFilesList />
  </v-container>
</template>

<script>
import MFIFilesList from '~/components/OrganizerComponents/MFIFiles/MFIFilesList.vue'

export default {
  middleware: 'MFIFiles',
  components: { MFIFilesList },
  head: {
    title: 'Real Web - МФИ Файлы',
  }
}
</script>