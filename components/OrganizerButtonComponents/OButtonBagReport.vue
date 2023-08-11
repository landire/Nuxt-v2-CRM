<template>
  <OButton :button-title="'Отчеты об ошибках'" :buttons="accessButtons" />
</template>

<script>
import OButton from '../ButtonComponents/OButton.vue'

export default {
  components: { OButton },
  props: ['doneReports', 'workReports', 'allReports'],
  data() {
    return {
      buttons: []
    }
  },

  mounted() {
    if (this.$store.state.permissionList.includes('BagReportUser')) {
      this.buttons.push({ name: 'Мои отчеты', link: '/mybagreports' })
    }

    if (this.$store.state.permissionList.includes('BagReportWorker')) {
      this.buttons.push({ name: 'В работе', link: '/worker' })
    }

    if (this.$store.state.permissionList.includes('BagReportAdmin')) {
      this.buttons.push({ name: 'Все отчеты', link: '/bagreports' })
    }
  },

  computed: {
    accessButtons() {
      if(this.doneReports !== null) {
        this.buttons = this.buttons.map(button => {
          if(button.name === 'Мои отчеты') {
            button.counterData = this.doneReports
          }
          
          return button
        })
      }

      if(this.workReports !== null) {
        this.buttons = this.buttons.map(button => {
          if(button.name === 'В работе') {
            button.counterData = this.workReports
          }

          return button
        })
      }

      if(this.allReports !== null) {
        this.buttons = this.buttons.map(button => {
          if(button.name === 'Все отчеты') {
            button.counterData = this.allReports
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