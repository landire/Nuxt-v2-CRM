require('dotenv').config();

export default {
  publicRuntimeConfig: {
    apolloHttp: process.env.APOLLO_HTTP_ENDPOINT,
    apolloWs: process.env.APOLLO_WEBSOCKET,
    jwtSecret: process.env.JWT_SECRET,
    idRoleBagReportAdmin: process.env.ID_ROLE_BAGREPORTADMIN
  },

  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'localhost'
  },

  ssr: true,

  plugins: [
    { src: '~/plugins/ymapPlugin.client.js', mode: 'client' },
    { src: '~/plugins/chart.client.js', mode: 'client' }
  ],

  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],

  css: ['~/assets/scss/main.scss'],

  styleResources: {
    scss: ['~/assets/scss/*.scss']
  },

  components: true,

  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/dotenv',
  ],

  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/style-resources'
  ],

  build: {
    postcss: false,
    loaders: {
      vue: {
        prettify: false
      }
    }
  },

  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js'
    }
  }
}
