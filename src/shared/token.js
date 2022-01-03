const jwt = require('jsonwebtoken')
const { JWT_EXPIRES_AFTER, JWT_PRIVATE_KEY } = process.env

const generateToken = ({ payload }) => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + Number(JWT_EXPIRES_AFTER),
    ...payload
  }, JWT_PRIVATE_KEY);
}

const verifyToken = (token) => {
  return jwt.verify(token, JWT_PRIVATE_KEY)
}

module.exports = {
  generateToken,
  verifyToken
}