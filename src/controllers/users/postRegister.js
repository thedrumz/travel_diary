const bcrypt = require('bcrypt')
const crypto = require('crypto')
const usersRepository = require('../../repository/mysql/mysqlUsersRepository')
const notifier = require('../../notifier/email/emailNotifier')

const { SALT_ROUNDS } = process.env

const postRegister = async (req, res) => {
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
}

module.exports = postRegister