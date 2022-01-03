const connection = require('./mysqlConnection')

const getUserByEmail = async (userEmail) => {
  const result = await connection.query("SELECT * FROM users WHERE email = ?", [userEmail])

  return result[0] && result[0][0]
}

const saveUser = async (user) => {
  const result = await connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [user.username, user.email, user.password])

  const { password, ...userWithoutPassword } = user
  return { ...userWithoutPassword, id: result[0].insertId }
}

const getUserById = async (userId) => {
  const result = await connection.query("SELECT * FROM users WHERE id = ?", [userId])

  return result[0] && result[0][0]
}

const updateAvatar = async (user) => {
  const [result] = await connection.query("UPDATE users SET avatar = ? WHERE id = ?", [user.avatar, user.id])

  return !!result.affectedRows
}

module.exports = {
  getUserByEmail,
  saveUser,
  getUserById,
  updateAvatar
}