import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Cần đăng nhập để truy cập'
    })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)
    console.log('Decoded token:', decoded)
    req.user = decoded
    next()
  } catch (error) {
    console.error('JWT verification error:', error.message)
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    })
  }
} 