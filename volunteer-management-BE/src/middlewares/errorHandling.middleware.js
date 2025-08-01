import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment.js'

export const errorhandlingMiddleware = (err, req, res,next) => {

  if (!err.StatusCodes)
    err.StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;


  const responseError = {
    statusCode: err.StatusCodes,
    message: err.message || StatusCodes[err.StatusCodes] || 'Internal Server Error',
    stack : err.stack
  }
  if (env.BUILD_MODE !== 'dev') delete responseError.stack


  res.status(responseError.statusCode).json(responseError)
}

