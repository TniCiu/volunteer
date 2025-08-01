import { getConnection } from '~/config/database'

export const initActivityTable = async () => {
  const conn = await getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slogan VARCHAR(255),
      date VARCHAR(100),
      time VARCHAR(100),
      participants_current INT DEFAULT 0,
      participants_max INT DEFAULT 0,
      participants_percentage INT DEFAULT 0,
      location VARCHAR(255),
      address VARCHAR(255),
      description TEXT,
      image VARCHAR(500),
      timeline JSON,
      leader_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (leader_id) REFERENCES users(id)
    )
  `)
}

export const initActivityTagTable = async () => {
  const conn = await getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS activity_tags (
      activity_id INT,
      tag_id INT,
      PRIMARY KEY (activity_id, tag_id),
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `)
}

export const createActivity = async (data) => {
  const conn = await getConnection()
  const [result] = await conn.execute(
    `INSERT INTO activities (title, slogan, date, time, participants_current, participants_max, participants_percentage, location, address, description, image, timeline, leader_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [data.title, data.slogan, data.date, data.time, data.participants_current, data.participants_max, data.participants_percentage, data.location, data.address, data.description, data.image, JSON.stringify(data.timeline), data.leader_id]
  )
  // Gán tag cho activity nếu có
  if (data.tag_ids && Array.isArray(data.tag_ids)) {
    for (const tagId of data.tag_ids) {
      await conn.execute('INSERT INTO activity_tags (activity_id, tag_id) VALUES (?, ?)', [result.insertId, tagId])
    }
  }
  return { id: result.insertId, ...data }
}

export const findActivityById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activities WHERE id = ?', [id])
  if (!rows[0]) return null
  if (rows[0].timeline) rows[0].timeline = typeof rows[0].timeline === 'string' ? JSON.parse(rows[0].timeline) : rows[0].timeline
  // Lấy leader
  let leader = null
  if (rows[0].leader_id) {
    const [leaders] = await conn.execute('SELECT id, name, email, phone,avatar, role FROM users WHERE id = ?', [rows[0].leader_id])
    leader = leaders[0] || null
  }
  // Lấy danh sách tag
  const [tags] = await conn.execute(
    'SELECT t.* FROM tags t JOIN activity_tags at ON t.id = at.tag_id WHERE at.activity_id = ?',
    [id]
  )
  // Lấy danh sách những người tình nguyện viên đã đăng ký tham gia
  const [registrations] = await conn.execute(
    `SELECT ar.*, u.name as user_name, u.avatar as user_avatar 
     FROM activity_registrations ar 
     LEFT JOIN users u ON ar.user_id = u.id 
     WHERE ar.activity_id = ? 
     ORDER BY ar.created_at DESC`,
    [id]
  )
  return { ...rows[0], tags, leader, registrations }
}

export const findAllActivities = async (userId = null) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activities')
  // Lấy tag và leader cho từng activity
  for (const row of rows) {
    row.timeline = row.timeline ? (typeof row.timeline === 'string' ? JSON.parse(row.timeline) : row.timeline) : []
    // Lấy leader
    if (row.leader_id) {
      const [leaders] = await conn.execute('SELECT id, name, email, phone, avatar, role FROM users WHERE id = ?', [row.leader_id])
      row.leader = leaders[0] || null
    } else {
      row.leader = null
    }
    const [tags] = await conn.execute(
      'SELECT t.* FROM tags t JOIN activity_tags at ON t.id = at.tag_id WHERE at.activity_id = ?',
      [row.id]
    )
    row.tags = tags
    
    // Lấy danh sách tình nguyện viên đã đăng ký
    const [registrations] = await conn.execute(
      `SELECT ar.*, u.name as user_name, u.avatar as user_avatar 
       FROM activity_registrations ar 
       LEFT JOIN users u ON ar.user_id = u.id 
       WHERE ar.activity_id = ? 
       ORDER BY ar.created_at DESC`,
      [row.id]
    )
    row.registrations = registrations
    
    // Kiểm tra xem user hiện tại đã đăng ký hoạt động này chưa
    if (userId) {
      const [userRegistration] = await conn.execute(
        'SELECT id, status FROM activity_registrations WHERE activity_id = ? AND user_id = ?',
        [row.id, userId]
      )
      row.isRegistered = userRegistration.length > 0
      row.registrationStatus = userRegistration[0]?.status || null
      row.registrationId = userRegistration[0]?.id || null
    } else {
      row.isRegistered = false
      row.registrationStatus = null
      row.registrationId = null
    }
  }
  return rows
}

export const updateActivity = async (id, data) => {
  const conn = await getConnection()
  await conn.execute(
    'UPDATE activities SET title = ?, slogan = ?, date = ?, time = ?, participants_current = ?, participants_max = ?, participants_percentage = ?, location = ?, address = ?, description = ?, image = ?, timeline = ?, leader_id = ? WHERE id = ?',
    [data.title, data.slogan, data.date, data.time, data.participants_current, data.participants_max, data.participants_percentage, data.location, data.address, data.description, data.image, JSON.stringify(data.timeline), data.leader_id, id]
  )
  // Cập nhật tag nếu có
  if (data.tag_ids && Array.isArray(data.tag_ids)) {
    await conn.execute('DELETE FROM activity_tags WHERE activity_id = ?', [id])
    for (const tagId of data.tag_ids) {
      await conn.execute('INSERT INTO activity_tags (activity_id, tag_id) VALUES (?, ?)', [id, tagId])
    }
  }
  
  // Trả về dữ liệu đầy đủ sau khi cập nhật
  return await findActivityById(id)
}

export const deleteActivity = async (id) => {
  const conn = await getConnection()
  await conn.execute('DELETE FROM activities WHERE id = ?', [id])
  await conn.execute('DELETE FROM activity_tags WHERE activity_id = ?', [id])
  return { deleted: true }
}

// Hàm lấy danh sách đăng ký theo trạng thái
export const getActivityRegistrationsByStatus = async (activityId, status = null) => {
  const conn = await getConnection()
  let query = `
    SELECT ar.*, u.name as user_name, u.avatar as user_avatar 
    FROM activity_registrations ar 
    LEFT JOIN users u ON ar.user_id = u.id 
    WHERE ar.activity_id = ?
  `
  let params = [activityId]
  
  if (status) {
    query += ' AND ar.status = ?'
    params.push(status)
  }
  
  query += ' ORDER BY ar.created_at DESC'
  
  const [registrations] = await conn.execute(query, params)
  return registrations
}

// Hàm lấy thống kê đăng ký theo trạng thái
export const getActivityRegistrationStats = async (activityId) => {
  const conn = await getConnection()
  const [stats] = await conn.execute(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
     FROM activity_registrations 
     WHERE activity_id = ?`,
    [activityId]
  )
  return stats[0]
} 