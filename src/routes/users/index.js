const router = require('express').Router()
const postRegister = require('../../controllers/users/postRegister')

router.use('/register', postRegister)

module.exports = router