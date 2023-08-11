<template>
  <OButton :button-title="'МФИ'" :buttons="accessButtons" />
</template>

<script>
import OButton from '../ButtonComponents/OButton.vue'

export default {
  components: { OButton },
  props: ['ufmsErrors'],
  data() {
    return {
      buttons: []
    }
  },

  mounted() {
    if (this.$store.state.permissionList.includes('UFMSAdmin')) {
      this.buttons.push({ name: 'Справочник УФМС', link: '/ufms' })
    }

    if ((this.$store.state.permissionList.includes('MFIFilesAdmin')
      || this.$store.state.permissionList.includes('MFIFilesUser'))) {
      this.buttons.push({ name: 'МФИ Файлы', link: '/mfi' })
    }
  },

  computed: {
    accessButtons() {
      if(this.ufmsErrors !== null) {
        this.buttons = this.buttons.map(button => {
          if(button.name === 'Справочник УФМС') {
            button.counterData = this.ufmsErrors
          }

          return button
        })
      }


      this.buttons = this.buttons.sort((a, b) => b.counterData > a.counterData)

      return this.buttons
    }
  },
}
</script>