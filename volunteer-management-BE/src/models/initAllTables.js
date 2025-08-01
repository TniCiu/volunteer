import { initUserTable } from './user.model'
import { initTagTable } from './tag.model'
import { initActivityTable, initActivityTagTable } from './activity.model'
import { initActivityReportTable } from './activityReport.model'
import { initNotificationTable } from './notification.model'
import { initActivityRegistrationTable } from './activityRegistration.model'

export const initAllTables = async () => {
  try {
    await initUserTable()
    await initTagTable()
    await initActivityTable()
    await initActivityTagTable()
    await initActivityReportTable()
    await initNotificationTable()
    await initActivityRegistrationTable()
    
    // Chạy migration để thêm cột color vào bảng tags
    
    // Add other table initializations here as needed
  } catch (error) {
    console.error('Error initializing tables:', error)
    throw error
  }
}