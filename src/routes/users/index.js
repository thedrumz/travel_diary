const router = require('express').Router()
const { postRegister, postLogin, patchAvatar } = require('../../controllers/users')
const isAuthorized = require('../../middlewares/isAuthorized')

router.post('/register', postRegister)
router.post('/login', postLogin)
router.patch('/avatar', isAuthorized, patchAvatar)

module.exports = router