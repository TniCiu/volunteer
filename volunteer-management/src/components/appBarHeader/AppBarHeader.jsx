import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Breadcrumbs,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Search as SearchIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const AppBarHeader = ({
  isMobile,
  setDrawerOpen,
  getPageIcon,
  getPageTitle,
  searchQuery,
  setSearchQuery,
  isFullscreen,
  toggleFullscreen
}) => {
  return (
    <>
      {isMobile && (
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={() => setDrawerOpen(true)} 
          sx={{ 
            mr: 2,
            bgcolor: '#f5f5f5',
            '&:hover': { bgcolor: '#e0e0e0' }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Breadcrumbs and Page Title */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Breadcrumbs 
          separator={<ArrowRightIcon fontSize="small" sx={{ color: '#666' }} />}
          sx={{ mb: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.875rem' }}>
            <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Quản lý Hệ Thống
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#333', fontSize: '0.875rem', fontWeight: 500 }}>
            {getPageIcon()}
            <Typography sx={{ ml: 0.5, fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>
          </Box>
        </Breadcrumbs>
        
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: '#1a237e',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {getPageIcon()}
          {getPageTitle()}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        alignItems: 'center',
        bgcolor: '#f8f9fa',
        borderRadius: 3,
        px: 2,
        py: 0.5,
        mr: 2,
        minWidth: 300,
        border: '1px solid #e0e0e0'
      }}>
        <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '14px',
            width: '100%',
            color: '#333'
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Fullscreen Toggle */}
        <Tooltip title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
          <IconButton 
            onClick={toggleFullscreen}
            sx={{ 
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e0e0e0' }
            }}
          >
            {isFullscreen ? 
              <FullscreenExitIcon sx={{ color: '#666' }} /> : 
              <FullscreenIcon sx={{ color: '#666' }} />
            }
          </IconButton>
        </Tooltip>

        {/* Settings */}
        <Tooltip title="Cài đặt">
          <IconButton 
            sx={{ 
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e0e0e0' }
            }}
          >
            <SettingsIcon sx={{ color: '#666' }} />
          </IconButton>
        </Tooltip>

        {/* Help */}
        <Tooltip title="Trợ giúp">
          <IconButton 
            sx={{ 
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e0e0e0' }
            }}
          >
            <HelpIcon sx={{ color: '#666' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default AppBarHeader; 