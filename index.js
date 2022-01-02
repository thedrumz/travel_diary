const express = require('express')
require('dotenv').config()

const { BASE_URL, PORT } = process.env

const app = express()

app.use(express.json())

app.use('/', (req, res) => {
  res.send("Hello travel diary")
})

app.listen(PORT, () => {
  console.log(`🔌 Server is running on ${BASE_URL}:${PORT}`)
})