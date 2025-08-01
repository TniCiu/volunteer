import { StatusCodes } from 'http-status-codes'
import { ActivityService } from '~/services/activity.service'

const createNew = async (req, res, next) => {
  try {
    // Đảm bảo nhận đúng tag_ids (mảng)
    if (req.body.tag_id && !req.body.tag_ids) {
      req.body.tag_ids = req.body.tag_id
      delete req.body.tag_id
    }
    const result = await ActivityService.createActivity(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const activity = await ActivityService.getActivityById(req.params.id)
    if (!activity) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Activity not found' })
    }
    res.status(StatusCodes.OK).json(activity)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    // Lấy userId từ request (có thể từ token hoặc query parameter)
    const userId = req.user?.id || req.query.userId || null
    const activities = await ActivityService.getAllActivities(userId)
    res.status(StatusCodes.OK).json(activities)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    // Đảm bảo nhận đúng tag_ids (mảng)
    if (req.body.tag_id && !req.body.tag_ids) {
      req.body.tag_ids = req.body.tag_id
      delete req.body.tag_id
    }
    const activity = await ActivityService.updateActivityById(req.params.id, req.body)
    res.status(StatusCodes.OK).json(activity)
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const result = await ActivityService.deleteActivityById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getRegistrations = async (req, res, next) => {
  try {
    const { status } = req.query
    const registrations = await ActivityService.getActivityRegistrations(req.params.id, status)
    res.status(StatusCodes.OK).json(registrations)
  } catch (error) {
    next(error)
  }
}

const getRegistrationStats = async (req, res, next) => {
  try {
    const stats = await ActivityService.getActivityRegistrationStats(req.params.id)
    res.status(StatusCodes.OK).json(stats)
  } catch (error) {
    next(error)
  }
}

export const activityController = {
  createNew,
  getDetails,
  getAll,
  update,
  deleteOne,
  getRegistrations,
  getRegistrationStats
} 