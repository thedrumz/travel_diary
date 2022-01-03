const express = require('express')
const baseRoutes = require('./routes')

const app = express()

app.use(express.json())
app.use('/', baseRoutes)

module.exports = app