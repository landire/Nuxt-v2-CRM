<template>
  <v-container>
    <TelegramGroup />
  </v-container>
</template>

<script>
import TelegramGroup from '~/components/OrganizerComponents/Admin/TelegramGroup/TelegramGroup.vue'

export default {
  middleware: 'Admin',
  components: { TelegramGroup },
  head: {
    title: 'Real Web - Телеграмм группа',
  }
}
</script>