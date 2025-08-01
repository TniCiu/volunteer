import * as NotificationModel from '~/models/notification.model'
import { io } from '~/socket/index'

const createNotification = async (data) => {
  const notification = await NotificationModel.createNotification(data)
  // Gửi socket cho user nhận thông báo
  if (io && data.user_id) {
    io.to(`user:${data.user_id}`).emit('notification', notification)
  }
  return notification
}

const getNotificationById = async (id) => await NotificationModel.findNotificationById(id)
const getNotificationsByUser = async (user_id) => await NotificationModel.findNotificationsByUser(user_id)
const markNotificationRead = async (id) => await NotificationModel.markNotificationRead(id)
const deleteNotificationById = async (id) => await NotificationModel.deleteNotification(id)

export const NotificationService = {
  createNotification,
  getNotificationById,
  getNotificationsByUser,
  markNotificationRead,
  deleteNotificationById
} 