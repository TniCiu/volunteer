import { env } from './environment'
import mysql from 'mysql2/promise'

let connection

export const CONNECT_DB = async () => {
  connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  })
}

export const getConnection = async () => {
  if (!connection) await CONNECT_DB()
  return connection
}

export const CLOSE_DB = async () => {
  if (connection) {
    await connection.end()
  }
}