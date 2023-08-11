import Vue from 'vue'
import { Bar, Pie } from 'vue-chartjs'

Vue.component('BarChart', {
  extends: Bar,
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
  },

  mounted() {
    this.renderChart(this.data, this.options)
  },
})

Vue.component('PieChart', {
  extends: Pie,
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      required: false,
    },
  },

  watch: {
    data() {
      this.renderChart(this.data, this.options)
    },
  },

  mounted() {
    this.renderChart(this.data, this.options)
  },
})
