<template>
  <v-container>
    <Agreement />
  </v-container>
</template>

<script>
import Agreement from '~/components/OrganizerComponents/Agreement/Agreement.vue'


export default {
  middleware: 'CreateDogovorAdmin',
  components: { Agreement },
  head: {
    title: 'Real Web - Заключение договора'
  },
}
</script>