import mysql from 'mysql2/promise'
import { env } from './src/config/environment.js'

const addColorColumn = async () => {
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  })

  try {
    // Kiểm tra xem cột color đã tồn tại chưa
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'tags' 
      AND COLUMN_NAME = 'color'
    `)
    
    if (columns.length === 0) {
      // Thêm cột color nếu chưa tồn tại
      await connection.execute(`
        ALTER TABLE tags 
        ADD COLUMN color VARCHAR(7) DEFAULT '#2196F3' 
        AFTER description
      `)
      console.log('✅ Đã thêm cột color vào bảng tags')
    } else {
      console.log('ℹ️ Cột color đã tồn tại trong bảng tags')
    }
  } catch (error) {
    console.error('❌ Lỗi khi thêm cột color:', error.message)
  } finally {
    await connection.end()
  }
}

addColorColumn() 