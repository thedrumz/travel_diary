const bcrypt = require('bcrypt')

const { SALT_ROUNDS } = process.env

const encrypt = async (data) => {
  return bcrypt.hash(data, Number(SALT_ROUNDS))
}

const compare = async (data, encrypted) => {
  return bcrypt.compare(data, encrypted)
}

module.exports = {
  encrypt,
  compare
}