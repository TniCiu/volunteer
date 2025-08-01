import express from 'express'
import {
  createActivityRegistration,
  getActivityRegistrationById,
  getActivityRegistrationsByActivityId,
  getActivityRegistrationsByUserId,
  getAllActivityRegistrations,
  updateActivityRegistrationStatus,
  deleteActivityRegistration,
  checkUserActivityRegistration
} from '~/controllers/activityRegistration.controller'
import { authenticateToken } from '~/middlewares/auth.middleware'

const router = express.Router()

// Tạo đăng ký tham gia hoạt động
router.post('/', authenticateToken, createActivityRegistration)

// Lấy tất cả đăng ký (cho admin)
router.get('/', authenticateToken, getAllActivityRegistrations)

// Lấy thông tin đăng ký theo ID
router.get('/:id', getActivityRegistrationById)

// Lấy danh sách đăng ký theo activity ID
router.get('/activity/:activityId', getActivityRegistrationsByActivityId)

// Lấy danh sách đăng ký theo user ID
router.get('/user/:userId', authenticateToken, getActivityRegistrationsByUserId)

// Cập nhật trạng thái đăng ký
router.put('/:id/status', updateActivityRegistrationStatus)

// Xóa đăng ký
router.delete('/:id', deleteActivityRegistration)

// Kiểm tra user đã đăng ký activity chưa
router.get('/check/:activityId', authenticateToken, checkUserActivityRegistration)

export default router