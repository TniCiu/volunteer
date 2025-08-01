import express from 'express'
import { activityController } from '~/controllers/activity.controller'

const router = express.Router()

router.route('/')
  .get(activityController.getAll)
  .post(activityController.createNew)

router.route('/:id')
  .get(activityController.getDetails)
  .put(activityController.update)
  .delete(activityController.deleteOne)

router.route('/:id/registrations')
  .get(activityController.getRegistrations)

router.route('/:id/registration-stats')
  .get(activityController.getRegistrationStats)

export const ActivityRoute = router 