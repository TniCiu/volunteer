import { getConnection } from '~/config/database'

export const initActivityReportTable = async () => {
  const conn = await getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS activity_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      activity_id INT NOT NULL,
      report_date DATE NOT NULL,
      participants_count INT DEFAULT 0,
      leader_id INT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
}

export const createActivityReport = async (data) => {
  const conn = await getConnection()
  const [result] = await conn.execute(
    `INSERT INTO activity_reports (activity_id, report_date, participants_count, leader_id, description)
     VALUES (?, ?, ?, ?, ?)` ,
    [data.activity_id, data.report_date, data.participants_count, data.leader_id, data.description]
  )
  return { id: result.insertId, ...data }
}

export const findActivityReportById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activity_reports WHERE id = ?', [id])
  return rows[0]
}

export const findAllActivityReports = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM activity_reports')
  return rows
}

export const updateActivityReport = async (id, data) => {
  const conn = await getConnection()
  await conn.execute(
    `UPDATE activity_reports SET activity_id = ?, report_date = ?, participants_count = ?, leader_id = ?, description = ? WHERE id = ?`,
    [data.activity_id, data.report_date, data.participants_count, data.leader_id, data.description, id]
  )
  return { id, ...data }
}

export const deleteActivityReport = async (id) => {
  const conn = await getConnection()
  await conn.execute('DELETE FROM activity_reports WHERE id = ?', [id])
  return { deleted: true }
} 