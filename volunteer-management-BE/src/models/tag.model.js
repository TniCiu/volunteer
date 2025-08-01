import { getConnection } from '~/config/database'

export const initTagTable = async () => {
  const conn = await getConnection()
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      color VARCHAR(7) DEFAULT '#2196F3',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
}

export const createTag = async (data) => {
  const conn = await getConnection()
  const [result] = await conn.execute(
    'INSERT INTO tags (name, description, color) VALUES (?, ?, ?)',
    [data.name, data.description, data.color || '#2196F3']
  )
  return { id: result.insertId, ...data }
}

export const findTagById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM tags WHERE id = ?', [id])
  return rows[0]
}

export const findAllTags = async () => {
  const conn = await getConnection()
  const [rows] = await conn.execute('SELECT * FROM tags')
  return rows
}

export const updateTag = async (id, data) => {
  const conn = await getConnection()
  await conn.execute(
    'UPDATE tags SET name = ?, description = ?, color = ? WHERE id = ?',
    [data.name, data.description, data.color || '#2196F3', id]
  )
  return { id, ...data }
}

export const deleteTag = async (id) => {
  const conn = await getConnection()
  await conn.execute('DELETE FROM tags WHERE id = ?', [id])
  return { deleted: true }
} 