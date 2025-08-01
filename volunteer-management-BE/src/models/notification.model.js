import { getConnection } from '~/config/database'
import { NotificationType } from '~/enums/notification.enum'

export const initNotificationTable = async () => {
  const conn = await getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      activity_id INT,
      type ENUM('${Object.values(NotificationType).join("', '")}') NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
    )
  `)
}

export const createNotification = async (data) => {
  const conn = await getConnection()
  const [result] = await conn.execute(
    `INSERT INTO notifications (user_id, activity_id, type, message, is_read)
     VALUES (?, ?, ?, ?, ?)` ,
    [data.user_id, data.activity_id, data.type, data.message, !!data.is_read]
  )
  return { id: result.insertId, ...data }
}

export const findNotificationById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM notifications WHERE id = ?', [id])
  return rows[0]
}

export const findNotificationsByUser = async (user_id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [user_id])
  return rows
}

export const markNotificationRead = async (id) => {
  const conn = await getConnection()
  await conn.execute('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id])
  return { id, is_read: true }
}

export const deleteNotification = async (id) => {
  const conn = await getConnection()
  await conn.execute('DELETE FROM notifications WHERE id = ?', [id])
  return { deleted: true }
} 