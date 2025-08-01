import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [registrationUpdates, setRegistrationUpdates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const userRole = localStorage.getItem('role') || 'user';

  

    if (!token || !userId) {
      console.log('❌ Socket: No token or userId, skipping connection');
      return;
    }

    // Tạo kết nối socket - sử dụng port 5000 (backend default)
    const socketInstance = io('http://localhost:5000', {
      auth: {
        userId: userId,
        role: userRole
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    console.log('🔌 Socket: Connection attempt started...');

    // Xử lý sự kiện kết nối
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected successfully:', socketInstance.id);
      setIsConnected(true);
      
      // Chỉ hiển thị thông báo kết nối cho admin
      if (userRole === 'admin') {
        toast.success('Đã kết nối real-time!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    // Xử lý sự kiện ngắt kết nối
    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      
      // Chỉ hiển thị thông báo ngắt kết nối cho admin
      if (userRole === 'admin') {
        toast.warning('Mất kết nối real-time!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    // Xử lý lỗi kết nối
    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
      
      // Chỉ hiển thị thông báo lỗi cho admin
      if (userRole === 'admin') {
        toast.error('Lỗi kết nối real-time!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    // Lắng nghe cập nhật trạng thái đăng ký
    socketInstance.on('registrationStatusUpdate', (data) => {
      console.log('📨 Registration status update received:', data);
      
      // Thêm vào danh sách cập nhật
      setRegistrationUpdates(prev => [...prev, data]);
      
      // Chỉ hiển thị thông báo cho user (không phải admin)
      if (userRole !== 'admin') {
        const statusText = data.status === 'approved' ? 'đã được duyệt' : 
                          data.status === 'rejected' ? 'đã bị từ chối' : 
                          data.status === 'pending' ? 'đang chờ duyệt' : 'đã cập nhật';
        
        toast.success(`Đơn đăng ký của bạn ${statusText}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    // Lắng nghe đăng ký mới (cho admin)
    socketInstance.on('newRegistration', (data) => {
      console.log('📨 New registration received:', data);
      
      // Thêm vào danh sách cập nhật để NotificationList có thể xử lý
      setRegistrationUpdates(prev => [...prev, data]);
      
      if (userRole === 'admin') {
        // Tạo thông báo toast chi tiết hơn
        let toastMessage = 'Có đăng ký mới cần xét duyệt!';
        if (data.userInfo && data.activityInfo) {
          toastMessage = `${data.userInfo.full_name} đã đăng ký "${data.activityInfo.title}"`;
        } else if (data.userInfo) {
          toastMessage = `${data.userInfo.full_name} đã đăng ký hoạt động mới`;
        }
        
        toast.info(toastMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });

    setSocket(socketInstance);

    // Cleanup khi component unmount
    return () => {
      console.log('🧹 Socket: Cleaning up connection...');
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // Cleanup registration updates cũ (giữ tối đa 10 cập nhật)
  useEffect(() => {
    if (registrationUpdates.length > 10) {
      setRegistrationUpdates(prev => prev.slice(-10));
    }
  }, [registrationUpdates]);

  const value = {
    socket,
    isConnected,
    registrationUpdates,
    clearRegistrationUpdates: () => setRegistrationUpdates([])
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 