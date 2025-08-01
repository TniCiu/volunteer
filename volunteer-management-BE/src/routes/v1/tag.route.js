import express from 'express'
import { tagController } from '~/controllers/tag.controller'

const router = express.Router()

router.route('/')
  .get(tagController.getAll)
  .post(tagController.createNew)

router.route('/:id')
  .get(tagController.getDetails)
  .put(tagController.update)
  .delete(tagController.deleteOne)

export const TagRoute = router 