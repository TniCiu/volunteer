import express from 'express'
import { getStatisticsController, getDetailedStatisticsController } from '~/controllers/statistics.controller'
import { authenticateToken } from '~/middlewares/auth.middleware'

const router = express.Router()

// Lấy thống kê tổng quan
router.get('/', authenticateToken, getStatisticsController)

// Lấy thống kê chi tiết với filter
router.get('/detailed', authenticateToken, getDetailedStatisticsController)

export default router