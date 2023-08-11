<template>
  <v-container>
    <div class="d-flex flex-row">
      <div class="d-flex" v-for="(link, index) in links" :key="index">
        <v-icon>mdi-chevron-right</v-icon>
        <NuxtLink class="route-link" :id="link.path" :to="link.path">{{ link.name }}</NuxtLink>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.route-link {
  color: black !important;
}

.route-link:hover,
a:visited,
a:link,
a:active {
  text-decoration: none;
}
</style>

<script>

export default {
  props: ['linkList'],
  data() {
    return {
      links: this.linkList || []
    }
  },

  mounted() {
    this.links.forEach(link => {
      if (this.$route.path === link.path && process.client) {
        document.getElementById(link.path).style.fontWeight = 'bold'
      }
    })
  },
}
</script>