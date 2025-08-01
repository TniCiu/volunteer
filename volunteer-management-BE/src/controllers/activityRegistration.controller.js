import {
  createRegistration,
  getRegistrationById,
  getRegistrationsByActivityId,
  getRegistrationsByUserId,
  getAllRegistrations,
  updateStatus,
  deleteRegistrationById,
  checkRegistration
} from '~/services/activityRegistration.service'
import { emitRegistrationStatusUpdate, emitNewRegistration } from '~/socket/index'
import { getActivityById } from '~/services/activity.service'

export const createActivityRegistration = async (req, res, next) => {
  try {
    const registrationData = {
      ...req.body,
      user_id: req.user?.id || null // Lấy user_id từ token nếu có
    }

    const result = await createRegistration(registrationData)
    
    // Emit WebSocket để thông báo cho admin về đăng ký mới
    if (result.data) {
      console.log('📤 Emitting newRegistration for admin');
      
      // Lấy thông tin hoạt động để hiển thị trong notification
      let activityInfo = null;
      try {
        const activityResult = await getActivityById(result.data.activity_id);
        if (activityResult.data) {
          activityInfo = {
            title: activityResult.data.title,
            date: activityResult.data.date,
            location: activityResult.data.location
          };
        }
      } catch (error) {
        console.log('⚠️ Could not fetch activity info for notification:', error.message);
      }
      
      const socketData = {
        registrationId: result.data.id,
        activityId: result.data.activity_id,
        userId: result.data.user_id,
        status: 'pending',
        message: 'Có đăng ký mới cần xét duyệt',
        timestamp: new Date().toISOString(),
        // Thêm thông tin chi tiết để hiển thị trong notification
        userInfo: {
          full_name: result.data.full_name,
          email: result.data.email,
          phone: result.data.phone
        },
        activityInfo: activityInfo
      };
      
      console.log('📤 Socket data for new registration:', socketData);
      emitNewRegistration(null, socketData);
    }
    
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const getActivityRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await getRegistrationById(id)
    
    res.status(200).json({
      success: true,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const getActivityRegistrationsByActivityId = async (req, res, next) => {
  try {
    const { activityId } = req.params
    const result = await getRegistrationsByActivityId(activityId)
    
    res.status(200).json({
      success: true,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const getActivityRegistrationsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params
    const result = await getRegistrationsByUserId(userId)
    
    res.status(200).json({
      success: true,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const getAllActivityRegistrations = async (req, res, next) => {
  try {
    const result = await getAllRegistrations()
    
    res.status(200).json({
      success: true,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const updateActivityRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    console.log('🔄 Updating registration status - ID:', id, 'Status:', status);
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái là bắt buộc'
      })
    }

    const result = await updateStatus(id, status)
    console.log('✅ Registration status updated successfully:', result);
    
    // Emit WebSocket để cập nhật real-time cho user
    if (result.data && result.data.user_id) {
      console.log('📤 Preparing to emit WebSocket for user:', result.data.user_id);
      
      const socketData = {
        registrationId: id,
        activityId: result.data.activity_id,
        status: status,
        message: result.message,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Socket data to emit:', socketData);
      emitRegistrationStatusUpdate(result.data.user_id, socketData);
    } else {
      console.log('❌ No user_id found in result data:', result);
    }
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    console.error('❌ Error updating registration status:', error);
    next(error)
  }
}

export const deleteActivityRegistration = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await deleteRegistrationById(id)
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    next(error)
  }
}

export const checkUserActivityRegistration = async (req, res, next) => {
  try {
    const { activityId } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Cần đăng nhập để kiểm tra đăng ký'
      })
    }

    const result = await checkRegistration(activityId, userId)
    
    res.status(200).json({
      success: true,
      data: result.data,
      hasRegistered: result.hasRegistered
    })
  } catch (error) {
    next(error)
  }
} 