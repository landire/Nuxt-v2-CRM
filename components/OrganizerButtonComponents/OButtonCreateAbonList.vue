<template>
  <OButton :button-title="'Создание заявки'" :buttons="accessButtons" />
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
    if (this.$store.state.permissionList.includes('CreateAbonUser')) {
      this.buttons.push({ name: 'Создание заявки', link: '/create' })
    }

    if (this.$store.state.permissionList.includes('TarifAdmin')) {
      this.buttons.push({ name: 'Управление тарифами', link: '/tarifs' })
    }
  },

  computed: {
    accessButtons() {

      return this.buttons
    }
  },
}
</script>