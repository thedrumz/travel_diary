const crypto = require('crypto')
const fs = require('fs-extra')
const usersRepository = require('../../repository/mysql/mysqlUsersRepository')

const MAX_IMAGE_SIZE_IN_BYTES = 2 * 1000000
const ALLOWED_MIMETYPES = ['image/jpg', 'image/jpeg', 'image/png']
const UPLOADS_PATH = './uploads'

const patchAvatar = async (req, res) => {
  const { id: userId } = req.user
  const avatar = req.files.avatar

  if (!isValidImageSize(avatar.size)) {
    res.status(400)
    res.end(`Avatar size should be less than ${MAX_IMAGE_SIZE_IN_BYTES / 1000000} Mb`)
    return
  }

  if (!isValidImageMimeType(avatar.mimetype)) {
    res.status(400)
    res.end(`Avatar should be ${ALLOWED_MIMETYPES.map(getExtensionFromMimetype).join(', ')}`)
    return
  }

  let user
  try {
    user = await usersRepository.getUserById(userId)
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

  if (user.avatar) {
    await removeFile(user.avatar)
  }

  const imageName = createImageName(getExtensionFromMimetype(avatar.mimetype))

  try {
    await usersRepository.updateAvatar({ ...user, avatar: imageName })
  } catch (error) {
    res.status(500)
    res.end('Database error')
    return
  }
  
  fs.ensureDir(UPLOADS_PATH)
  avatar.mv(`${UPLOADS_PATH}/${imageName}`)

  res.send('ok')
}

const isValidImageSize = (size) => {
  return size <= MAX_IMAGE_SIZE_IN_BYTES
}

const isValidImageMimeType = (mimetype) => {
  return ALLOWED_MIMETYPES.includes(mimetype.toLowerCase())
}

const getExtensionFromMimetype = (mimetype) => {
  return mimetype.split('/')[1]
}

const removeFile = async (fileName) => {
  fs.remove(`${UPLOADS_PATH}/${fileName}`)
}

const createImageName = (extension) => {
  const randomHash = crypto.randomBytes(15).toString('hex')
  return `${randomHash}.${extension}`
}

module.exports = patchAvatar