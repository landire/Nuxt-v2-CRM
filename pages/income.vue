<template>
  <v-container>
    <Income />
  </v-container>
</template>

<script>
import Income from '~/components/OrganizerComponents/Income/Income.vue'



export default {
    middleware: "PaymentReport",
    components: { Income },
    head: {
        title: "Real Web - Поступления"
    },
}
</script>