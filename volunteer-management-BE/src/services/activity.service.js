import * as ActivityModel from '~/models/activity.model'
import * as UserModel from '~/models/user.model'
import { emitAssign, emitTaskUpdate } from '~/socket/index'

const createActivity = async (data) => {
  if (data.leader_id) {
    const leader = await UserModel.findUserById(data.leader_id)
    if (!leader || leader.role !== 'leader') {
      throw new Error('Người được chọn không phải leader hợp lệ')
    }
  }
  const activity = await ActivityModel.createActivity(data)
  // Gửi socket phân công leader
  if (data.leader_id) {
    emitAssign(data.leader_id, { activityId: activity.id, ...activity })
  }
  // Gửi socket cập nhật task cho leader và admin
  emitTaskUpdate([data.leader_id], activity)
  return activity
}

const getActivityById = async (id) => await ActivityModel.findActivityById(id)
const getAllActivities = async (userId = null) => await ActivityModel.findAllActivities(userId)

const updateActivityById = async (id, data) => {
  if (data.leader_id) {
    const leader = await UserModel.findUserById(data.leader_id)
    if (!leader || leader.role !== 'leader') {
      throw new Error('Người được chọn không phải leader hợp lệ')
    }
  }
  const activity = await ActivityModel.updateActivity(id, data)
  // Gửi socket cập nhật task cho leader và admin
  emitTaskUpdate([data.leader_id], { id, ...data })
  return activity
}

const deleteActivityById = async (id) => await ActivityModel.deleteActivity(id)

const getActivityRegistrations = async (activityId, status = null) => {
  return await ActivityModel.getActivityRegistrationsByStatus(activityId, status)
}

const getActivityRegistrationStats = async (activityId) => {
  return await ActivityModel.getActivityRegistrationStats(activityId)
}

export const ActivityService = {
  createActivity,
  getActivityById,
  getAllActivities,
  updateActivityById,
  deleteActivityById,
  getActivityRegistrations,
  getActivityRegistrationStats
} 