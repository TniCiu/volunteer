import { getConnection } from '~/config/database'

export const getStatistics = async () => {
  const conn = await getConnection()
  
  try {
    // Thống kê tổng quan
    const [volunteerCount] = await conn.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "volunteer" AND status = "active"'
    )
    
    const [leaderCount] = await conn.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "leader" AND status = "active"'
    )
    
    const [adminCount] = await conn.execute(
      'SELECT COUNT(*) as count FROM users WHERE role = "admin" AND status = "active"'
    )
    
    const [activityCount] = await conn.execute(
      'SELECT COUNT(*) as count FROM activities'
    )
    
    // Thống kê theo tháng (12 tháng gần nhất)
    const [monthlyStats] = await conn.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(CASE WHEN role = 'volunteer' THEN 1 END) as volunteers,
        COUNT(CASE WHEN role = 'leader' THEN 1 END) as leaders,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `)
    
    // Thống kê hoạt động theo tháng
    const [monthlyActivities] = await conn.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as activities
      FROM activities 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `)
    
    // Thống kê đăng ký hoạt động
    const [registrationStats] = await conn.execute(`
      SELECT 
        COUNT(*) as total_registrations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM activity_registrations
    `)
    
    // Top 5 tình nguyện viên tích cực nhất
    const [topVolunteers] = await conn.execute(`
      SELECT 
        u.id,
        u.name,
        u.avatar,
        COUNT(ar.id) as total_registrations,
        COUNT(CASE WHEN ar.status = 'approved' THEN 1 END) as approved_registrations
      FROM users u
      LEFT JOIN activity_registrations ar ON u.id = ar.user_id
      WHERE u.role = 'volunteer' AND u.status = 'active'
      GROUP BY u.id, u.name, u.avatar
      ORDER BY approved_registrations DESC
      LIMIT 5
    `)
    
    // Thống kê hoạt động theo trạng thái
    const [activityStatusStats] = await conn.execute(`
      SELECT 
        COUNT(*) as total_activities,
        COUNT(CASE WHEN DATE(date) < CURDATE() THEN 1 END) as completed,
        COUNT(CASE WHEN DATE(date) = CURDATE() THEN 1 END) as today,
        COUNT(CASE WHEN DATE(date) > CURDATE() THEN 1 END) as upcoming
      FROM activities
    `)
    
    // Thống kê theo tag (loại hoạt động)
    let activityTypeStats = []
    try {
      const [result] = await conn.execute(`
        SELECT 
          t.name,
          COALESCE(t.color, '#2196F3') as color,
          COUNT(at.activity_id) as count
        FROM tags t
        LEFT JOIN activity_tags at ON t.id = at.tag_id
        GROUP BY t.id, t.name, t.color
        ORDER BY count DESC
      `)
      activityTypeStats = result
    } catch (error) {
      // Nếu cột color chưa tồn tại, sử dụng query đơn giản hơn
      const [result] = await conn.execute(`
        SELECT 
          t.name,
          '#2196F3' as color,
          COUNT(at.activity_id) as count
        FROM tags t
        LEFT JOIN activity_tags at ON t.id = at.tag_id
        GROUP BY t.id, t.name
        ORDER BY count DESC
      `)
      activityTypeStats = result
    }
    
    return {
      overview: {
        volunteers: volunteerCount[0].count,
        leaders: leaderCount[0].count,
        admins: adminCount[0].count,
        activities: activityCount[0].count,
        total_users: volunteerCount[0].count + leaderCount[0].count + adminCount[0].count
      },
      monthly_stats: monthlyStats,
      monthly_activities: monthlyActivities,
      registration_stats: registrationStats[0],
      top_volunteers: topVolunteers,
      activity_status_stats: activityStatusStats[0],
      activity_type_stats: activityTypeStats
    }
  } catch (error) {
    throw new Error(`Error getting statistics: ${error.message}`)
  }
}

export const getDetailedStatistics = async (filters = {}) => {
  const conn = await getConnection()
  
  try {
    const { startDate, endDate, role } = filters
    let whereClause = 'WHERE 1=1'
    let params = []
    
    if (startDate && endDate) {
      whereClause += ' AND created_at BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }
    
    if (role) {
      whereClause += ' AND role = ?'
      params.push(role)
    }
    
    // Thống kê chi tiết người dùng
    const [userStats] = await conn.execute(`
      SELECT 
        role,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_count
      FROM users 
      ${whereClause}
      GROUP BY role
    `, params)
    
    // Thống kê hoạt động chi tiết
    const [activityStats] = await conn.execute(`
      SELECT 
        COUNT(*) as total_activities,
        AVG(participants_current) as avg_participants,
        MAX(participants_current) as max_participants,
        SUM(participants_current) as total_participants
      FROM activities 
      ${whereClause.replace('users', 'activities')}
    `, params)
    
    return {
      user_stats: userStats,
      activity_stats: activityStats[0]
    }
  } catch (error) {
    throw new Error(`Error getting detailed statistics: ${error.message}`)
  }
} 