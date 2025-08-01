import {
  createActivityRegistration,
  findRegistrationById,
  findRegistrationsByActivityId,
  findRegistrationsByUserId,
  findAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  checkUserRegistration
} from '~/models/activityRegistration.model'

export const createRegistration = async (data) => {
  try {
    // Kiểm tra xem user đã đăng ký activity này chưa
    if (data.user_id) {
      const existingRegistration = await checkUserRegistration(data.activity_id, data.user_id)
      if (existingRegistration) {
        throw new Error('Bạn đã đăng ký tham gia hoạt động này rồi')
      }
    }

    const registration = await createActivityRegistration(data)
    return {
      success: true,
      message: 'Đăng ký tham gia hoạt động thành công',
      data: registration
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể đăng ký tham gia hoạt động')
  }
}

export const getRegistrationById = async (id) => {
  try {
    const registration = await findRegistrationById(id)
    if (!registration) {
      throw new Error('Không tìm thấy đăng ký')
    }
    return {
      success: true,
      data: registration
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể lấy thông tin đăng ký')
  }
}

export const getRegistrationsByActivityId = async (activityId) => {
  try {
    const registrations = await findRegistrationsByActivityId(activityId)
    return {
      success: true,
      data: registrations
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể lấy danh sách đăng ký')
  }
}

export const getRegistrationsByUserId = async (userId) => {
  try {
    const registrations = await findRegistrationsByUserId(userId)
    return {
      success: true,
      data: registrations
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể lấy danh sách đăng ký')
  }
}

export const getAllRegistrations = async () => {
  try {
    const registrations = await findAllRegistrations()
    return {
      success: true,
      data: registrations
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể lấy danh sách đăng ký')
  }
}

export const updateStatus = async (id, status) => {
  try {
    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ')
    }

    const result = await updateRegistrationStatus(id, status)
    return {
      success: true,
      message: `Cập nhật trạng thái thành công: ${status}`,
      data: result
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể cập nhật trạng thái')
  }
}

export const deleteRegistrationById = async (id) => {
  try {
    const result = await deleteRegistration(id)
    return {
      success: true,
      message: 'Xóa đăng ký thành công',
      data: result
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể xóa đăng ký')
  }
}

export const checkRegistration = async (activityId, userId) => {
  try {
    const registration = await checkUserRegistration(activityId, userId)
    return {
      success: true,
      data: registration,
      hasRegistered: !!registration
    }
  } catch (error) {
    throw new Error(error.message || 'Không thể kiểm tra đăng ký')
  }
} 