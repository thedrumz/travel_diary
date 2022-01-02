const express = require('express')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
require('dotenv').config()
const usersRepository = require('./repository/mysql/mysqlUsersRepository')
const notifier = require('./notifier/email/emailNotifier')

const { BASE_URL, PORT, SALT_ROUNDS } = process.env

const app = express()

app.use(express.json())

app.post('/users/register', async (req, res) => {
  const user = req.body

  if (!user.email || !user.password) {
    res.status(400)
    res.end('You should provide an email and password')
    return
  }

  let existingUser
  try {
    existingUser = await usersRepository.getUserByEmail(user.email)
  } catch (error) {
    res.status(500)
    res.end(error.message)
    return
  }

  if (existingUser) {
    res.status(403)
    res.end('User already exists')
    return
  }

  let encryptedPassword
  try {
    encryptedPassword = await bcrypt.hash(user.password, Number(SALT_ROUNDS))
  } catch (error) {
    res.status(500)
    res.end(error.message)
    return
  }


  const registrationCode = crypto.randomBytes(40).toString('hex')

  let savedUser
  try {
    savedUser = await usersRepository.saveUser({ ...user, password: encryptedPassword, registrationCode })
  } catch (error) {
    res.status(500)
    res.end(error.message)
    return
  }

  notifier.accountConfirmation({ sendTo: savedUser.email, code: registrationCode })

  res.status(200)
  res.send(savedUser)
})

app.listen(PORT, () => {
  console.log(`🔌 Server is running on ${BASE_URL}:${PORT}`)
})