<template>
  <v-container>
    <TechAccept />
  </v-container>
</template>

<script>
import TechAccept from '~/components/OrganizerComponents/TechAccept/TechAccept.vue'


export default {
  middleware: 'TexAcceptAdmin',
  components: { TechAccept },
  head: {
    title: 'Real Web - Проверка тех. возможности'
  },
}
</script>