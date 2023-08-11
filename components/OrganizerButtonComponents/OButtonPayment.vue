<template>
  <OButton :button-title="'Отчетность'" :buttons="accessButtons" />
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
    if (this.$store.state.permissionList.includes('PaymentAdmin')) {
      this.buttons.push({ name: 'Платежи', link: '/payments' })
    }

    if (this.$store.state.permissionList.includes('PaymentReport')) {
      this.buttons.push({ name: 'Поступления', link: '/income' })
    }
  },

  computed: {
    accessButtons() {

      return this.buttons
    }
  }
}
</script>