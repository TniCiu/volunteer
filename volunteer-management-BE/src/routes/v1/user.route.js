import express from 'express'
import { userController } from '~/controllers/user.controller'

const router = express.Router()

router.route('/')
  .get(userController.getAll)
  .post(userController.createNew)

router.route('/login')
  .post(userController.login)

router.route('/volunteers')
  .get(userController.getAllVolunteers)

router.route('/leaders-admins')
  .get(userController.getAllLeadersAndAdmins)

router.route('/:id')
  .get(userController.getDetails)
  .put(userController.update)
  .delete(userController.deleteOne)

export const UserRoute = router
