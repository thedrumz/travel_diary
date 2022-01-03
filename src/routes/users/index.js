const router = require('express').Router()
const { postRegister, postLogin } = require('../../controllers/users')

router.use('/register', postRegister)
router.use('/login', postLogin)

module.exports = router