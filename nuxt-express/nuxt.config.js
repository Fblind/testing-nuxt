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
      { rel: 'stylesheet', type: 'text/css', href: '/css/main.css' },
    ],
    script: [
      { type: 'text/javascript', src: 'https://cdnjs.cloudflare.com/ajax/libs/html5-history-api/4.2.7/history.js' },
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
      //'vue-stash',
    ]
  },

  //Extend webpack configuration
  build: {
    extend (config, context) {
      // config is the webpack config
      // context.dev is a boolean, equals false when `nuxt build`
      // context.isClient is a boolean, let you know when you extend
      // the config for the client bundle or the server bundle
      if (context.isClient) {
        var globalPolyfill = [
          "babel-polyfill",
        ]
        var vendorPolyfills = [
          "eventsource-polyfill",
        ]
        config.entry.app = globalPolyfill.concat([config.entry.app])
        config.entry.vendor = vendorPolyfills.concat(config.entry.vendor)
      }
    }
  },

  plugins: [
    '~plugins/vue-inject',
    //'~plugins/register-store-data',
    //'~plugins/vue-stash'
  ]
}
