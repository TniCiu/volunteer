import express from 'express'
import { activityReportController } from '~/controllers/activityReport.controller'

const router = express.Router()

router.route('/')
  .get(activityReportController.getAll)
  .post(activityReportController.createNew)

router.route('/:id')
  .get(activityReportController.getDetails)
  .put(activityReportController.update)
  .delete(activityReportController.deleteOne)

export const ActivityReportRoute = router 