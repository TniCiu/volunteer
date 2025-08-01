import { StatusCodes } from 'http-status-codes'
import { ActivityReportService } from '~/services/activityReport.service'

const createNew = async (req, res, next) => {
  try {
    const result = await ActivityReportService.createActivityReport(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const report = await ActivityReportService.getActivityReportById(req.params.id)
    if (!report) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Report not found' })
    }
    res.status(StatusCodes.OK).json(report)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const reports = await ActivityReportService.getAllActivityReports()
    res.status(StatusCodes.OK).json(reports)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const report = await ActivityReportService.updateActivityReportById(req.params.id, req.body)
    res.status(StatusCodes.OK).json(report)
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const result = await ActivityReportService.deleteActivityReportById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const activityReportController = {
  createNew,
  getDetails,
  getAll,
  update,
  deleteOne
} 