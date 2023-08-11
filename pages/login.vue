<template>
  <v-container fill-height fluid>
    <Login />
  </v-container>
</template>

<script>
import Login from '~/components/HomeComponents/Login/Login.vue'

export default {
  components: { Login },
  layout: 'login'
}
</script>