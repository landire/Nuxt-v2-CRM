<template>
  <OButton :button-title="'Тех. возможности'" :buttons="accessButtons" />
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
    if (this.$store.state.permissionList.includes('TexAcceptAdmin')) {
      this.buttons.push({ name: 'Проверка тех. возможности', link: '/tech' })
    }
  },

  computed: {
    accessButtons() {

      return this.buttons
    }
  },
}
</script>