import { StatusCodes } from 'http-status-codes'
import { NotificationService } from '~/services/notification.service'
import { getAllRegistrations } from '~/services/activityRegistration.service'

const createNew = async (req, res, next) => {
  try {
    const result = await NotificationService.createNotification(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const notification = await NotificationService.getNotificationById(req.params.id)
    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Notification not found' })
    }
    res.status(StatusCodes.OK).json(notification)
  } catch (error) {
    next(error)
  }
}

const getByUser = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getNotificationsByUser(req.params.user_id)
    res.status(StatusCodes.OK).json(notifications)
  } catch (error) {
    next(error)
  }
}

const markRead = async (req, res, next) => {
  try {
    const result = await NotificationService.markNotificationRead(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteOne = async (req, res, next) => {
  try {
    const result = await NotificationService.deleteNotificationById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const getRegistrationNotifications = async (req, res, next) => {
  try {
    console.log('🔍 Fetching registration notifications...');
    
    // Lấy tất cả đăng ký có trạng thái pending
    const registrations = await getAllRegistrations();
    
    console.log('📊 Total registrations received:', registrations.data?.length || 0);
    
    if (!registrations.data || registrations.data.length === 0) {
      console.log('📭 No registrations found');
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Không có thông báo nào'
      });
    }

    // Lọc chỉ những đăng ký pending và tạo thông báo
    const pendingRegistrations = registrations.data.filter(reg => reg.status === 'pending');
    console.log('⏳ Pending registrations:', pendingRegistrations.length);
    
    const notifications = [];
    
    for (const registration of pendingRegistrations) {
      try {
        console.log('🔍 Processing registration:', registration.id, 'for activity:', registration.activity_id);
        
        // Sử dụng thông tin hoạt động đã có sẵn từ JOIN query
        const activityInfo = registration.activity_title ? {
          title: registration.activity_title,
          date: registration.activity_date,
          location: registration.activity_location
        } : null;

        const notification = {
          id: registration.id,
          registrationId: registration.id,
          activityId: registration.activity_id,
          userId: registration.user_id,
          title: activityInfo ? `Đăng ký mới: ${activityInfo.title}` : 'Đăng ký mới cần xét duyệt',
          message: activityInfo 
            ? `${registration.full_name} đã đăng ký tham gia "${activityInfo.title}" (${activityInfo.date})`
            : `${registration.full_name} (${registration.email}) đã đăng ký hoạt động mới`,
          type: 'registration',
          is_read: false,
          created_at: registration.created_at,
          priority: 'high',
          userInfo: {
            full_name: registration.full_name,
            email: registration.email,
            phone: registration.phone
          },
          activityInfo: activityInfo
        };
        
        notifications.push(notification);
        console.log('✅ Created notification for registration:', registration.id);
      } catch (error) {
        console.log('⚠️ Error processing notification for registration:', registration.id, error.message);
        // Vẫn tạo notification cơ bản nếu không lấy được thông tin hoạt động
        const notification = {
          id: registration.id,
          registrationId: registration.id,
          activityId: registration.activity_id,
          userId: registration.user_id,
          title: 'Đăng ký mới cần xét duyệt',
          message: `${registration.full_name} (${registration.email}) đã đăng ký hoạt động mới`,
          type: 'registration',
          is_read: false,
          created_at: registration.created_at,
          priority: 'high',
          userInfo: {
            full_name: registration.full_name,
            email: registration.email,
            phone: registration.phone
          },
          activityInfo: null
        };
        notifications.push(notification);
        console.log('✅ Created basic notification for registration:', registration.id);
      }
    }

    // Sắp xếp theo thời gian tạo mới nhất
    notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log('📤 Sending notifications:', notifications.length);

    res.status(200).json({
      success: true,
      data: notifications,
      message: `Có ${notifications.length} thông báo đăng ký mới`
    });
    
  } catch (error) {
    console.error('❌ Error fetching registration notifications:', error);
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    
    // Trong thực tế, bạn có thể lưu trạng thái đã đọc vào database
    // Hiện tại chỉ trả về success
    res.status(200).json({
      success: true,
      message: 'Đã đánh dấu thông báo là đã đọc'
    });
    
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    next(error);
  }
};

export const notificationController = {
  createNew,
  getDetails,
  getByUser,
  markRead,
  deleteOne
} 