import * as ActivityReportModel from '~/models/activityReport.model'
import * as ActivityModel from '~/models/activity.model'
import { emitReportUpdate } from '~/socket/index'

const createActivityReport = async (data) => {
  // Validate leader_id là leader của activity
  const activity = await ActivityModel.findActivityById(data.activity_id)
  if (!activity || activity.leader_id !== data.leader_id) {
    throw new Error('Người báo cáo phải là leader được phân công cho hoạt động này')
  }
  const report = await ActivityReportModel.createActivityReport(data)
  // Gửi socket báo cáo mới cho admin và các leader khác (nếu cần)
  emitReportUpdate(null, report) // null: gửi cho tất cả leader và admin
  return report
}

const getActivityReportById = async (id) => await ActivityReportModel.findActivityReportById(id)
const getAllActivityReports = async () => await ActivityReportModel.findAllActivityReports()

const updateActivityReportById = async (id, data) => {
  // Validate leader_id là leader của activity
  const activity = await ActivityModel.findActivityById(data.activity_id)
  if (!activity || activity.leader_id !== data.leader_id) {
    throw new Error('Người báo cáo phải là leader được phân công cho hoạt động này')
  }
  const report = await ActivityReportModel.updateActivityReport(id, data)
  emitReportUpdate(null, report)
  return report
}

const deleteActivityReportById = async (id) => await ActivityReportModel.deleteActivityReport(id)

export const ActivityReportService = {
  createActivityReport,
  getActivityReportById,
  getAllActivityReports,
  updateActivityReportById,
  deleteActivityReportById
} 