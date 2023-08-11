<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <DistrictsList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DistrictsList from '~/components/OrganizerComponents/Districts/Districts/DistrictsList.vue'

export default {
  middleware: 'DistrictsAdmin',
  components: { DistrictsList },
  head: {
    title: 'Real Web - Районы',
  }
}
</script>