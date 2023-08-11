<template>
  <OButton :button-title="'Подключение'" :buttons="accessButtons" />
</template>

<script>
import OButton from '../ButtonComponents/OButton.vue'

export default {
  components: { OButton },
  data() {
    return {
      buttons: []
    }
  },

  mounted() {
    if (this.$store.state.permissionList.includes('ConnectAdmin')) {
      this.buttons.push({ name: 'Подключение', link: '/connection' })
    }
  },

  computed: {
    accessButtons() {

      return this.buttons
    }
  },
}
</script>
