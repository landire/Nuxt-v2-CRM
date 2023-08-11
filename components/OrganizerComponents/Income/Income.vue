<template>
  <div>
    <RoutePanel :link-list="links" />
    <v-container class="box-container">
      <client-only>
        <BarChart :data="barData" :options="barOptions" />
      </client-only>
      <v-row class="mt-4">
        <v-col cols="3">
          <div class="d-flex">
            <v-select label="От" :items="dateList" v-model="otDate" clearable outlined></v-select>
          </div>
        </v-col>
        <v-divider vertical></v-divider>
      </v-row>
      <v-row>
        <v-col cols="3">
          <div class="d-flex">
            <v-select label="До" :items="dateList" v-model="doDate" clearable outlined></v-select>
          </div>
        </v-col>
        <v-divider vertical></v-divider>
      </v-row>
      <template>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="justify-center">
              <span>Платежи по районам за {{ date }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <client-only>
                  <PieChart :data="pieData" />
                </client-only>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-container>
                <v-combobox v-model="selectedDistricts" :items="districtsList" label="Районы" multiple chips outlined
                  clearable></v-combobox>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-container>
  </div>
</template>

<script>
import script from './script'
import RoutePanel from '~/components/ButtonComponents/RoutePanel.vue'

export default {
  mixins: [script],
  components: { RoutePanel }
}
</script>