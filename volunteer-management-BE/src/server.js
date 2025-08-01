import express from 'express'
import { env } from './config/environment'
import { CONNECT_DB, CLOSE_DB } from './config/database'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from './routes/v1'
import { errorhandlingMiddleware } from './middlewares/errorHandling.middleware'
import { initAllTables } from './models/initAllTables'
import http from 'http'
import { initSocket, io } from './socket/index'
import cors from 'cors'

const START_SERVER = () => {
  const app = express();
  app.use(cors({
    origin: '*', // Cho phép frontend của bạn
    credentials: true // Nếu bạn dùng cookie, JWT qua header cần bật
  }));
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(`/${env.VERSION}`, APIs_V1)
  app.use(errorhandlingMiddleware)

  const server = http.createServer(app)
  initSocket(server)

  server.listen(env.APP_PORT, env.APP_HOST,() => {
    console.log(`3. Server running at http://${env.APP_HOST}:${env.APP_PORT}`)
  });

  exitHook(() => {
    console.log('4. Disconnecting from Database with Mysql...')
    CLOSE_DB();
    console.log('5. Disconnected from Database with Mysql! ')
  });
}

export { io }

(async () => {
  try {
    console.log('1. connecting from Database with Mysql...')
    await CONNECT_DB()
    await initAllTables()
    console.log('2. connected to mysql with Mysql2/Promise succsessfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to Mysql: ', error)
    process.exit(0)
  }
})()
