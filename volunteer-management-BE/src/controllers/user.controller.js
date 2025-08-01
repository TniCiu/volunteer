import { StatusCodes } from 'http-status-codes'
import { UserService } from '~/services/user.service'

const createNew = async (req, res, next) => {
  try {
    const result = await UserService.createUser(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    console.error('Create user error:', error);
    res.status(StatusCodes.BAD_REQUEST).json({ 
      message: error.message,
      error: error.message 
    })
  }
}

const login = async (req, res, next) => {
  try {
    const result = await UserService.login(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message })
  }
}

const getDetails = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' })
    }
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const users = await UserService.getAllUsers()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

// Thêm 2 controller mới
const getAllVolunteers = async (req, res, next) => {
  try {
    const volunteers = await UserService.getAllVolunteers()
    res.status(StatusCodes.OK).json(volunteers)
  } catch (error) {
    next(error)
  }
}

const getAllLeadersAndAdmins = async (req, res, next) => {
  try {
    const leadersAndAdmins = await UserService.getAllLeadersAndAdmins()
    res.status(StatusCodes.OK).json(leadersAndAdmins)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const user = await UserService.updateUserById(req.params.id, req.body)
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const result = await UserService.deleteUserById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  login,
  getDetails,
  getAll,
  getAllVolunteers,
  getAllLeadersAndAdmins,
  update,
  deleteOne
}
