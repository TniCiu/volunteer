import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Task as TaskIcon,
  LocalOffer as TagIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as LeaderIcon
} from '@mui/icons-material';

const Sidebar = ({ currentPage, setCurrentPage, userInfo, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Thông kê', icon: <DashboardIcon /> },
    { id: 'volunteer-manager', label: 'Quản lý tình nguyện viên', icon: <PeopleIcon /> },
    { id: 'leader-manager', label: 'Quản lý nội bộ', icon: <TaskIcon /> },
    { id: 'tag-manager', label: 'Quản lý loại hoạt động', icon: <TagIcon /> },
    { id: 'activity-manager', label: 'Quản lý hoạt động', icon: <EventIcon /> },
    { id: 'registration-manager', label: 'Quản lý đơn đăng ký', icon: <AssignmentIcon /> },
  ];

  return (
    <Box sx={{
      width: 280,
      bgcolor: '#1a237e',
      height: '100vh',
      color: 'white',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1200
    }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ mr: 1 }} />
          Quản Lý Hệ Thống
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: '#FFD700' }} src={userInfo?.avatar}>
            {userRole === 'admin' ? <AdminIcon /> : <LeaderIcon />}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {userInfo?.name || 'Admin User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {userRole === 'admin' ? 'Quản trị viên' : userRole === 'leader' ? 'Trưởng nhóm' : 'Tình nguyện viên'}
            </Typography>
          </Box>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              button
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: currentPage === item.id ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
              onClick={() => setCurrentPage(item.id)}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, { 
                  sx: { color: currentPage === item.id ? '#FFD700' : 'rgba(255,255,255,0.7)' } 
                })}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar; 