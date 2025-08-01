import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { UserRoute } from './user.route'
import { TagRoute } from './tag.route'
import { ActivityRoute } from './activity.route'
import { ActivityReportRoute } from './activityReport.route'
import { NotificationRoute } from './notification.route'
import ActivityRegistrationRoute from './activityRegistration.route'
import StatisticsRoute from './statistics.route'

const router = express.Router()

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' })
})
router.use('/users', UserRoute)
router.use('/tags', TagRoute)
router.use('/activities', ActivityRoute)
router.use('/activity-reports', ActivityReportRoute)
router.use('/notifications', NotificationRoute)
router.use('/activity-registrations', ActivityRegistrationRoute)
router.use('/statistics', StatisticsRoute)
export const APIs_V1 = router