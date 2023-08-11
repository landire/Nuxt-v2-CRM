<template>
  <v-container>
    <User />
  </v-container>
</template>

<script>
import User from '~/components/OrganizerComponents/Admin/User/User.vue'

export default {
  middleware: 'Admin',
  components: { User },
  head: {
    title: 'Real Web - Пользователь',
  },
}
</script>