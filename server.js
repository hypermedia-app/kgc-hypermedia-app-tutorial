/* eslint-disable @typescript-eslint/no-var-requires,no-console */
const express = require('express')
const fallback = require('express-history-api-fallback')
const conditional = require('express-conditional-middleware')
const knossos = require('@hydrofoil/knossos')
const { pathToRegexp } = require('path-to-regexp')
const compression = require('compression')

const app = express()

app.enable('trust proxy')
app.use(compression())

const root = './apps/www/dist'
app.use('/app', express.static(root))
app.use('/app', conditional(
  req => req.accepts('html'),
  fallback('index.html', { root }),
))

const apis = knossos.default({
  endpointUrl: `${process.env.SPARQL_ENDPOINT}`,
  name: 'creta-todos',
  user: process.env.SPARQL_USER,
  password: process.env.SPARQL_PASSWORD,
})
app.use(pathToRegexp(process.env.API_ROOTS, [], { end: false }), apis)

app.listen(parseInt(process.env.PORT, 10) || 8080)
