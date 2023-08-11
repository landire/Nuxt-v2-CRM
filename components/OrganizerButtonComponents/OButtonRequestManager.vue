<template>
  <OButton :button-title="'Менеджер заявок'" :buttons="accessButtons" />
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
    if (this.$store.state.permissionList.includes('FeedbackAdmin')) {
      this.buttons.push({ name: 'Обратная связь', link: '/feedback' })
    }

    if (this.$store.state.permissionList.includes('CreateDogovorAdmin')) {
      this.buttons.push({ name: 'Заключение договора', link: '/agreement' })
    }

    if (this.$store.state.permissionList.includes('RequestUser')) {
      this.buttons.push({ name: 'Контроль заявок', link: '/control' })
    }

    if (this.$store.state.permissionList.includes('QualityControlAdmin')) {
      this.buttons.push({ name: 'Причины отказа', link: '/rejectreasons' })
    }
  },

  computed: {
    accessButtons() {

      return this.buttons
    }
  }
}
</script>