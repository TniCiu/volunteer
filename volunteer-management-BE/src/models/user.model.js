import { getConnection  } from '~/config/database'

export const initUserTable = async () => {
  const conn = await getConnection()

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      avatar TEXT,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(255) UNIQUE,
      role ENUM('admin', 'leader', 'volunteer') DEFAULT 'volunteer',
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
}
export const findUserByEmail = async (email) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE email = ?', [email])
  return rows[0]
}

export const findUserByPhone = async (phone) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE phone = ?', [phone])
  return rows[0]
}
export const createUser = async (data) => {
  const conn = await getConnection()
  const [result] = await conn.execute(
    `INSERT INTO users (name, avatar, phone, email, password, role, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name, 
      data.avatar, 
      data.phone, 
      data.email, 
      data.password, 
      data.role || 'volunteer', 
      data.status || 'active'
    ]
  )
  return { id: result.insertId, ...data, status: data.status || 'active' }
}


export const findUserById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute(
    'SELECT * FROM users WHERE id = ?', [id]
  )
  return rows[0]
}

export const findAllUsers = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users')
  return rows
}

// Thêm các method mới để lấy user theo role
export const findUsersByRole = async (role) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE role = ?', [role])
  return rows
}

export const findVolunteers = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE role = "volunteer"')
  return rows
}

export const findLeaders = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE role = "leader"')
  return rows
}

export const findAdmins = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE role = "admin"')
  return rows
}

export const findLeadersAndAdmins = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM users WHERE role IN ("leader", "admin")')
  return rows
}

export const updateUser = async (id, data) => {
  const conn = await getConnection()
  
  // Lọc ra các trường có giá trị (không phải undefined)
  const updateFields = []
  const updateValues = []
  
  if (data.name !== undefined) {
    updateFields.push('name = ?')
    updateValues.push(data.name)
  }
  
  if (data.avatar !== undefined) {
    updateFields.push('avatar = ?')
    updateValues.push(data.avatar)
  }
  
  if (data.phone !== undefined) {
    updateFields.push('phone = ?')
    updateValues.push(data.phone)
  }
  
  if (data.email !== undefined) {
    updateFields.push('email = ?')
    updateValues.push(data.email)
  }
  
  if (data.role !== undefined) {
    updateFields.push('role = ?')
    updateValues.push(data.role)
  }
  
  if (data.status !== undefined) {
    updateFields.push('status = ?')
    updateValues.push(data.status)
  }
  
  // Thêm id vào cuối mảng values
  updateValues.push(id)
  
  if (updateFields.length > 0) {
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`
    await conn.execute(updateQuery, updateValues)
  }
  
  return { id, ...data }
}

export const deleteUser = async (id) => {
  const conn = await getConnection()
  await conn.execute('DELETE FROM users WHERE id = ?', [id])
  return { deleted: true }
}
