import { StatusCodes } from 'http-status-codes'
import { getStatistics, getDetailedStatistics } from '~/services/statistics.service'

export const getStatisticsController = async (req, res) => {
  try {
    const statistics = await getStatistics()
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Thống kê được lấy thành công',
      data: statistics
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: error.message
    })
  }
}

export const getDetailedStatisticsController = async (req, res) => {
  try {
    const { startDate, endDate, role } = req.query
    const filters = {}
    
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    if (role) filters.role = role
    
    const statistics = await getDetailedStatistics(filters)
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Thống kê chi tiết được lấy thành công',
      data: statistics
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Lỗi khi lấy thống kê chi tiết',
      error: error.message
    })
  }
} 