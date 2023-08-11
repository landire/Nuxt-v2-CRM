<template>
  <v-container>
    <PaymentsList />
  </v-container>
</template>

<script>
import PaymentsList from '~/components/OrganizerComponents/Payments/PaymentsList.vue'

export default {
  middleware: 'PaymentAdmin',
  components: { PaymentsList },
  head: {
    title: 'Real Web - Платежи',
  }
}
</script>