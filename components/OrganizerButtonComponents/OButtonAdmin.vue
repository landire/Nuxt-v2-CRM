<template>
  <OButton :button-title="'Админка'" :buttons="accessButtons" />
</template>

<script>
import OButton from '../ButtonComponents/OButton.vue'

export default {
  components: { OButton },
  props: ['districtsErrors'],
  data() {
    return {
      buttons: []
    }
  },

  mounted() {
    if (this.$store.state.permissionList.includes('DistrictsAdmin')) {
      this.buttons.push({ name: 'Районы', link: '/districts' })
    }

    if (this.$store.state.permissionList.includes('Admin')) {
      this.buttons.push({ name: 'Кабинет администратора', link: '/admin' })
    }

  },

  computed: {
    accessButtons() {

      if(this.districtsErrors !== null) {
        this.buttons = this.buttons.map(button => {
          if(button.name === 'Районы') {
            button.counterData = this.districtsErrors
          }
          
          return button
        })
      } 

      this.buttons = this.buttons.sort((a, b) => b.counterData > a.counterData)

      return this.buttons
    }
  }
}
</script>