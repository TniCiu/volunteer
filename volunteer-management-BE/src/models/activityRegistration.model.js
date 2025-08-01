import { getConnection } from '~/config/database'

export const initActivityRegistrationTable = async () => {
  const conn = await getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS activity_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      activity_id INT NOT NULL,
      user_id INT,
      full_name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      birth_date DATE,
      gender ENUM('Nam', 'Nữ', 'Khác') DEFAULT 'Nam',
      address TEXT,
      education_level VARCHAR(100),
      school VARCHAR(255),
      major VARCHAR(255),
      occupation VARCHAR(255),
      company VARCHAR(255),
      experience TEXT,
      skills TEXT,
      participation_ability VARCHAR(255),
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)
}

export const createActivityRegistration = async (data) => {
  const conn = await getConnection()
  const [result] = await conn.execute(
    `INSERT INTO activity_registrations (
      activity_id, user_id, full_name, phone, email, birth_date, gender, 
      address, education_level, school, major, occupation, company, 
      experience, skills, participation_ability
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.activity_id, data.user_id, data.full_name, data.phone, data.email,
      data.birth_date, data.gender, data.address, data.education_level,
      data.school, data.major, data.occupation, data.company,
      data.experience, data.skills, data.participation_ability
    ]
  )
  
  // Cập nhật số lượng thành viên hiện tại của activity
  await updateActivityParticipants(data.activity_id)
  
  return { id: result.insertId, ...data }
}

export const findRegistrationById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activity_registrations WHERE id = ?', [id])
  if (!rows[0]) return null
  
  // Lấy thông tin activity
  const [activities] = await conn.execute('SELECT title FROM activities WHERE id = ?', [rows[0].activity_id])
  rows[0].activity = activities[0] || null
  
  return rows[0]
}

export const findRegistrationsByActivityId = async (activityId) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activity_registrations WHERE activity_id = ?', [activityId])
  return rows
}

export const findAllRegistrations = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute(`
    SELECT ar.*, a.title as activity_title, a.date as activity_date, a.location as activity_location, a.image as activity_image
    FROM activity_registrations ar
    LEFT JOIN activities a ON ar.activity_id = a.id
    ORDER BY ar.created_at DESC
  `)
  return rows
}

export const findRegistrationsByUserId = async (userId) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activity_registrations WHERE user_id = ?', [userId])
  
  // Lấy thông tin activity cho mỗi registration
  for (const row of rows) {
    const [activities] = await conn.execute('SELECT title, date, location FROM activities WHERE id = ?', [row.activity_id])
    row.activity = activities[0] || null
  }
  
  return rows
}

export const updateRegistrationStatus = async (id, status) => {
  const conn = await getConnection()
  await conn.execute('UPDATE activity_registrations SET status = ? WHERE id = ?', [status, id])
  
  // Lấy thông tin đầy đủ của registration sau khi update
  const [rows] = await conn.execute('SELECT * FROM activity_registrations WHERE id = ?', [id])
  
  // Lấy activity_id để cập nhật số lượng thành viên
  if (rows[0]) {
    await updateActivityParticipants(rows[0].activity_id)
  }
  
  // Trả về thông tin đầy đủ thay vì chỉ id và status
  return rows[0] || { id, status }
}

export const deleteRegistration = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT activity_id FROM activity_registrations WHERE id = ?', [id])
  
  await conn.execute('DELETE FROM activity_registrations WHERE id = ?', [id])
  
  // Cập nhật số lượng thành viên nếu có activity_id
  if (rows[0]) {
    await updateActivityParticipants(rows[0].activity_id)
  }
  
  return { deleted: true }
}

// Hàm helper để cập nhật số lượng thành viên của activity
const updateActivityParticipants = async (activityId) => {
  const conn = await getConnection()
  
  // Đếm số lượng registration đã được approved
  const [approvedCount] = await conn.execute(
    'SELECT COUNT(*) as count FROM activity_registrations WHERE activity_id = ? AND status = "approved"',
    [activityId]
  )
  
  // Lấy thông tin activity hiện tại
  const [activities] = await conn.execute(
    'SELECT participants_max FROM activities WHERE id = ?',
    [activityId]
  )
  
  if (activities[0]) {
    const currentParticipants = approvedCount[0].count
    const maxParticipants = activities[0].participants_max
    const percentage = maxParticipants > 0 ? Math.round((currentParticipants / maxParticipants) * 100) : 0
    
    // Cập nhật số lượng thành viên hiện tại và phần trăm
    await conn.execute(
      'UPDATE activities SET participants_current = ?, participants_percentage = ? WHERE id = ?',
      [currentParticipants, percentage, activityId]
    )
  }
}

export const checkUserRegistration = async (activityId, userId) => {
  const conn = await getConnection()
  const [rows] = await conn.execute(
    'SELECT * FROM activity_registrations WHERE activity_id = ? AND user_id = ?',
    [activityId, userId]
  )
  return rows[0] || null
} 