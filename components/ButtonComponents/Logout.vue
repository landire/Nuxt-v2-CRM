<template>
  <v-btn dark icon type="submit" @submit.prevent @click="logout">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"  viewBox="0 0 24 24">
      <title>Выйти</title>
      <path fill="#FFFFFF"
        d="M19,3H5C3.89,3 3,3.89 3,5V9H5V5H19V19H5V15H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M10.08,15.58L11.5,17L16.5,12L11.5,7L10.08,8.41L12.67,11H3V13H12.67L10.08,15.58Z" />
    </svg>
  </v-btn>
</template>

<script>

export default {
  methods: {
    // Метод кнопки Выхода с аккаунта
    async logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    },
  },
}
</script>
