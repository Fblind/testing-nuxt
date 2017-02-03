module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'css/main.css' },
    ]
  },
  /*
  ** Global CSS
  */
  css: ['~assets/css/main.css'],
  /*
  ** Add env variables
  */
  env: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  },
  /*
  ** Add axios globally
  */
  build: {
    vendor: [
      'axios',
      'vue-stash'
    ]
  },

  plugins: [
    '~plugins/vue-inject',
    //'~plugins/register-store-data',
    //'~plugins/vue-stash'
  ]
}
