import { Server as SocketIOServer } from 'socket.io'

let io = null

export const initSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: { origin: '*' }
  })

  io.use((socket, next) => {
    const { userId, role } = socket.handshake.auth || socket.handshake.query
    console.log('🔌 Socket middleware - User ID:', userId, 'Role:', role);
    if (!userId) return next(new Error('Unauthorized'))
    socket.data = { userId, role }
    next()
  })

  io.on('connection', (socket) => {
    const { userId, role } = socket.data
    console.log('✅ Socket connected - User ID:', userId, 'Role:', role, 'Socket ID:', socket.id);
    
    socket.join(`user:${userId}`)
    if (role === 'leader') socket.join('leaders')
    if (role === 'admin') socket.join('admins')
    
    console.log('👥 Socket joined rooms:', socket.rooms);
    
    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected - User ID:', userId, 'Reason:', reason);
    })
  })

  return io
}

export { io }

// Emit cập nhật task cho leader hoặc admin
export const emitTaskUpdate = (userIds, taskData) => {
  if (!io) return
  if (Array.isArray(userIds)) {
    userIds.forEach(id => io.to(`user:${id}`).emit('taskUpdate', taskData))
  } else if (userIds) {
    io.to(`user:${userIds}`).emit('taskUpdate', taskData)
  } else {
    io.to('leaders').emit('taskUpdate', taskData)
    io.to('admins').emit('taskUpdate', taskData)
  }
}

// Emit báo cáo mới cho leader/admin
export const emitReportUpdate = (userIds, reportData) => {
  if (!io) return
  if (Array.isArray(userIds)) {
    userIds.forEach(id => io.to(`user:${id}`).emit('reportUpdate', reportData))
  } else if (userIds) {
    io.to(`user:${userIds}`).emit('reportUpdate', reportData)
  } else {
    io.to('leaders').emit('reportUpdate', reportData)
    io.to('admins').emit('reportUpdate', reportData)
  }
}

// Emit deadline nhắc nhở
export const emitDeadline = (userIds, deadlineData) => {
  if (!io || !userId) return
  if (Array.isArray(userIds)) {
    userIds.forEach(id => io.to(`user:${id}`).emit('deadline', deadlineData))
  } else if (userIds) {
    io.to(`user:${userIds}`).emit('deadline', deadlineData)
  } else {
    io.to('leaders').emit('deadline', deadlineData)
  }
}

// Emit phân công leader mới
export const emitAssign = (userId, assignData) => {
  if (!io || !userId) return
  io.to(`user:${userId}`).emit('assign', assignData)
}

// Emit cập nhật trạng thái đăng ký hoạt động
export const emitRegistrationStatusUpdate = (userId, registrationData) => {
  if (!io || !userId) {
    console.log('❌ emitRegistrationStatusUpdate: io or userId not available');
    return;
  }
  
  console.log('📤 Emitting registrationStatusUpdate to user:', userId);
  console.log('📤 Registration data:', registrationData);
  
  io.to(`user:${userId}`).emit('registrationStatusUpdate', registrationData);
  
  // Log số lượng clients trong room
  const room = io.sockets.adapter.rooms.get(`user:${userId}`);
  console.log('👥 Clients in room user:' + userId + ':', room ? room.size : 0);
}

// Emit thông báo cho admin khi có đăng ký mới
export const emitNewRegistration = (adminUserIds, registrationData) => {
  if (!io) {
    console.log('❌ emitNewRegistration: io not available');
    return;
  }
  
  console.log('📤 Emitting newRegistration to admins');
  console.log('📤 Registration data:', registrationData);
  
  if (Array.isArray(adminUserIds)) {
    adminUserIds.forEach(id => io.to(`user:${id}`).emit('newRegistration', registrationData))
  } else if (adminUserIds) {
    io.to(`user:${adminUserIds}`).emit('newRegistration', registrationData)
  } else {
    io.to('admins').emit('newRegistration', registrationData)
  }
  
  // Log số lượng clients trong admin room
  const adminRoom = io.sockets.adapter.rooms.get('admins');
  console.log('👥 Clients in admin room:', adminRoom ? adminRoom.size : 0);
}