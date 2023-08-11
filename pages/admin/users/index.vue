<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <UsersList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UsersList from '~/components/OrganizerComponents/Admin/Users/UsersList.vue'

export default {
  middleware: 'Admin',
  components: { UsersList },
  head: {
    title: 'Real Web - Пользователи',
  }
}
</script>