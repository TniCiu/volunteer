import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Drawer,
  useTheme,
  useMediaQuery,
  Snackbar,
  Slide,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Task as TaskIcon,
  LocalOffer as TagIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import Statistics from './statistics';
import VolunteerManager from './Volunteermanager';
import LeaderManager from './leadermanager';
import TagManager from './TagManager';
import ActivityManager from './ActivityManager';
import RegistrationManager from './RegistrationManager';
import Profiles from '../../../../components/appBar/menus/profile';
import { useAuth } from '../../../../components/appBar/auth/AuthContext';
import { fetchUserInfoAPI } from '../../../../apis';
import { StatusBar, Sidebar, AppBarHeader } from '../../../../components';

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { userRole } = useAuth();
  
  // State management
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');



  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('id');
        if (userId) {
          const userData = await fetchUserInfoAPI(userId);
          setUserInfo(userData);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);





  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Thông kê tổng quan',
      'volunteer-manager': 'Quản lý tình nguyện viên',
      'leader-manager': 'Quản lý nội bộ',
      'tag-manager': 'Quản lý loại hoạt động',
      'activity-manager': 'Quản lý hoạt động',
      'registration-manager': 'Quản lý đơn đăng ký',
    };
    return titles[currentPage] || 'Dashboard';
  };

  const getPageIcon = () => {
    const icons = {
      'dashboard': <DashboardIcon />,
      'volunteer-manager': <PeopleIcon />,
      'leader-manager': <TaskIcon />,
      'tag-manager': <TagIcon />,
      'activity-manager': <EventIcon />,
      'registration-manager': <AssignmentIcon />,
    };
    return icons[currentPage] || <DashboardIcon />;
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      {!isMobile && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userInfo={userInfo} userRole={userRole} />}

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 280, bgcolor: '#1a237e', color: 'white' } }}
      >
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userInfo={userInfo} userRole={userRole} />
      </Drawer>

      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: { md: '280px' }
      }}>
        <AppBar position="static" sx={{
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <Toolbar sx={{ px: 3, py: 1, minHeight: 70 }}>
            <AppBarHeader
              isMobile={isMobile}
              setDrawerOpen={setDrawerOpen}
              getPageIcon={getPageIcon}
              getPageTitle={getPageTitle}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />


            {/* User Profile */}
            <Box sx={{ ml: 1 }}>
              <Profiles />
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{
          py: 3,
          flexGrow: 1,
          position: 'relative',
          px: { xs: 2, md: 4 }
        }}>
          {/* Status Bar */}
          <StatusBar userRole={userRole} isDarkMode={isDarkMode} />

          {currentPage === 'dashboard' && (
            <>
              <Statistics />
            </>
          )}

          {currentPage === 'volunteer-manager' && (
            <VolunteerManager />
          )}

          {currentPage === 'leader-manager' && (
            <LeaderManager />
          )}

          {currentPage === 'tag-manager' && (
            <TagManager />
          )}

          {currentPage === 'activity-manager' && (
            <ActivityManager />
          )}

          {currentPage === 'registration-manager' && (
            <RegistrationManager />
          )}

          
        </Container>
      </Box>

    </Box>
  );
};

export default AdminDashboard;
