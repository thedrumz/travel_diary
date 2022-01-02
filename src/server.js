const app = require('./app')

const { BASE_URL, PORT } = process.env

const start = () => {
  app.listen(PORT, () => {
    console.log(`🔌 Server is running on ${BASE_URL}:${PORT}`)
  })
}

module.exports = {
  start
}