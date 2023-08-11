import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
  apiKey: '278a312b-df31-4b71-bfb3-98969f3eafe7',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
}

Vue.use(YmapPlugin, settings);
