const crypto = require('crypto')
const encryptor = require('../../shared/encryptor')
const userSchema = require('../../validationSchemas/userSchema')
const usersRepository = require('../../repository/mysql/mysqlUsersRepository')
const notifier = require('../../notifier/email/emailNotifier')

const postRegister = async (req, res) => {
  const user = req.body

  try {
    await userSchema.validateAsync(user)
  } catch (error) {
    res.status(400)
    res.send(error.message)
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
    encryptedPassword = await encryptor.encrypt(user.password)
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
}

module.exports = postRegister