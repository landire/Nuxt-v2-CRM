<template>
  <v-container>
    <Feedback />
  </v-container>
</template>

<script>
import Feedback from '~/components/OrganizerComponents/Feedback/Feedback.vue'


export default {
  middleware: 'FeedbackAdmin',
  components: { Feedback },
  head: {
    title: 'Real Web - Обратная связь'
  },
}
</script>