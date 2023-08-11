<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TelegramGroupsList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TelegramGroupsList from '~/components/OrganizerComponents/Admin/TelegramGroups/TelegramGroupsList.vue'

export default {
  middleware: 'Admin',
  components: { TelegramGroupsList },
  head: {
    title: 'Real Web - Телеграмм группы',
  }
}
</script>