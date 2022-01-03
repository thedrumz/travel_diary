const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const credentialsSchema = require('../../validationSchemas/credentialsSchema')
const usersRepository = require('../../repository/mysql/mysqlUsersRepository')

const { JWT_EXPIRES_AFTER, JWT_PRIVATE_KEY } = process.env

const postLogin = async (req, res) => {
  const credentials = req.body

  try {
    await credentialsSchema.validateAsync(credentials)
  } catch (error) {
    res.status(400)
    res.send(error.message)
    return
  }

  let user
  try {
    user = await usersRepository.getUserByEmail(credentials.email)
  } catch (error) {
    res.status(500)
    res.end('Database error')
    return
  }

  if (!user) {
    res.status(404)
    res.end('User not found')
    return
  }
  
  if (!await bcrypt.compare(credentials.password, user.password)) {
    res.status(403)
    res.end('Invalid credentials')
    return
  }

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + Number(JWT_EXPIRES_AFTER),
    user: { id: user.id }
  }, JWT_PRIVATE_KEY);

  res.status(200)
  res.send({ token })
}

module.exports = postLogin