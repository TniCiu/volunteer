import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material'

const NotificationMenu = ({ 
  notifications, 
  notificationsAnchor, 
  handleNotificationsOpen, 
  handleNotificationsClose, 
  handleNotificationClick,
  onViewAllNotifications 
}) => {
  return (
    <>
      <Tooltip title="Thông báo">
        <IconButton 
          onClick={handleNotificationsOpen}
          sx={{ 
            bgcolor: '#f5f5f5',
            '&:hover': { bgcolor: '#e0e0e0' },
            position: 'relative'
          }}
        >
          <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
            <NotificationsActiveIcon sx={{ color: '#666' }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            width: 430,
            maxHeight: 600,
            mt: 1,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            overflow: 'hidden'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 4, 
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Thông báo
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1rem' }}>
              {notifications.filter(n => !n.read).length} thông báo chưa đọc
            </Typography>
          </Box>
        </Box>
        
        {/* Notifications List */}
        <Box sx={{ 
          maxHeight: 380, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}>
          {notifications.map((notification, index) => (
            <Box
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                p: 3.5,
                borderBottom: index < notifications.length - 1 ? '1px solid #f0f0f0' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                '&:hover': { 
                  bgcolor: '#f8f9fa',
                  transform: 'translateX(4px)'
                },
                bgcolor: notification.read ? 'transparent' : '#f0f8ff',
                '&::before': notification.read ? {} : {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '5px',
                  background: 'linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)',
                  borderRadius: '0 3px 3px 0'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                {/* Notification Icon */}
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: notification.read 
                    ? 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
                    : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  color: notification.read ? '#666' : '#1976d2',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {notification.title.includes('Đăng ký') && <AssignmentIcon sx={{ fontSize: 26 }} />}
                  {notification.title.includes('Thống kê') && <AssessmentIcon sx={{ fontSize: 26 }} />}
                  {notification.title.includes('Nhắc nhở') && <NotificationsActiveIcon sx={{ fontSize: 26 }} />}
                  {!notification.title.includes('Đăng ký') && !notification.title.includes('Thống kê') && !notification.title.includes('Nhắc nhở') && 
                    <NotificationsIcon sx={{ fontSize: 26 }} />
                  }
                </Box>

                {/* Notification Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 1.5 
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: notification.read ? 500 : 700,
                      color: notification.read ? '#555' : '#1a237e',
                      lineHeight: 1.3,
                      fontSize: '1.1rem'
                    }}>
                      {notification.title}
                    </Typography>
                    {!notification.read && (
                      <Box sx={{ 
                        width: 14, 
                        height: 14, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #f44336 0%, #ff5722 100%)',
                        boxShadow: '0 3px 6px rgba(244, 67, 54, 0.3)',
                        flexShrink: 0,
                        ml: 1
                      }} />
                    )}
                  </Box>
                  
                  <Typography variant="body1" sx={{ 
                    color: '#666', 
                    mb: 2,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '0.95rem'
                  }}>
                    {notification.message}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                  }}>
                    <Typography variant="body2" sx={{ 
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.8,
                      fontSize: '0.9rem'
                    }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: '#999' 
                      }} />
                      {notification.time}
                    </Typography>
                    
                    {!notification.read && (
                      <Chip 
                        label="Mới"
                        size="medium"
                        sx={{ 
                          height: 24,
                          fontSize: '0.8rem',
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        
                 {/* Footer */}
         <Box sx={{ 
           p: 2.5, 
           borderTop: '1px solid #e0e0e0', 
           background: '#fafafa',
           textAlign: 'center'
         }}>
           <Typography 
             variant="body1" 
             onClick={() => {
               if (onViewAllNotifications) {
                 onViewAllNotifications();
               }
               handleNotificationsClose();
             }}
             sx={{ 
               color: '#1976d2', 
               cursor: 'pointer',
               fontWeight: 600,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               gap: 1.5,
               py: 1,
               px: 2.5,
               borderRadius: 2,
               transition: 'all 0.2s ease',
               fontSize: '0.95rem',
               '&:hover': { 
                 bgcolor: '#e3f2fd',
                 transform: 'translateY(-1px)'
               }
             }}
           >
             <NotificationsIcon sx={{ fontSize: 20 }} />
             Xem tất cả thông báo
           </Typography>
         </Box>
      </Menu>
    </>
  );
};

export default NotificationMenu; 