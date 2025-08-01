import express from 'express'
import { notificationController, getRegistrationNotifications, markNotificationAsRead } from '~/controllers/notification.controller'

const router = express.Router()

router.route('/')
  .post(notificationController.createNew)

router.route('/:id')
  .get(notificationController.getDetails)
  .delete(notificationController.deleteOne)

router.route('/:id/read')
  .put(notificationController.markRead)

router.route('/user/:user_id')
  .get(notificationController.getByUser)

// Routes cho thông báo đăng ký mới
router.route('/registrations')
  .get(getRegistrationNotifications)

router.route('/registrations/:notificationId/read')
  .put(markNotificationAsRead)

export const NotificationRoute = router 