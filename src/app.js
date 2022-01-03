const express = require('express')
const fileUpload = require('express-fileupload');
const baseRoutes = require('./routes')

const app = express()

app.use(express.json())
app.use('/public', express.static('uploads'));
app.use(fileUpload());
app.use('/', baseRoutes)

module.exports = app