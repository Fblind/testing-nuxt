'use strict';

const Nuxt = require('nuxt')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || '3000'
const bodyParser = require("body-parser")

app.use(express.static('assets'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Render every route with nuxt.js
app.set('port', port)
// Import API Routes
app.use('/api', require('./api/index'))

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

app.use(require('./middlewares/loadAccount'))

// Init Nuxt.js
const nuxt = new Nuxt(config)

app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
    .catch((error) => {
      console.error(error) // eslint-disable-line no-console
      process.exit(1)
    })
}

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
