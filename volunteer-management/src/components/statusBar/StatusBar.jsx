import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const StatusBar = ({ userRole, isDarkMode }) => {
  return (
    <Box sx={{ 
      mb: 3, 
      p: 2.5, 
      bgcolor: isDarkMode ? '#2d2d2d' : 'white', 
      borderRadius: 3, 
      boxShadow: isDarkMode 
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.1)',
      border: isDarkMode ? '1px solid #444' : '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
        zIndex: 1
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          px: 2.5,
          py: 1,
          bgcolor: isDarkMode ? '#1b5e20' : '#e8f5e8',
          borderRadius: 2,
          border: isDarkMode ? '1px solid #4caf50' : '1px solid #4caf50'
        }}>
          <Box sx={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%', 
            bgcolor: '#4caf50',
            animation: 'pulse 2s infinite'
          }} />
          <Typography variant="body2" sx={{ 
            color: isDarkMode ? '#a5d6a7' : '#2e7d32', 
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Hệ thống hoạt động bình thường
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ 
          color: isDarkMode ? '#b0b0b0' : '#666',
          fontSize: '0.85rem'
        }}>
          Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative', zIndex: 2 }}>
        <Chip 
          label={`${userRole === 'admin' ? 'Quản trị viên' : 'Trưởng nhóm'}`}
          size="small"
          sx={{ 
            bgcolor: userRole === 'admin' 
              ? (isDarkMode ? '#ffebee' : '#ffebee')
              : (isDarkMode ? '#e3f2fd' : '#e3f2fd'),
            color: userRole === 'admin' 
              ? (isDarkMode ? '#ef5350' : '#c62828')
              : (isDarkMode ? '#42a5f5' : '#1565c0'),
            fontWeight: 600,
            fontSize: '0.8rem'
          }}
        />
        <Chip 
          label="Trực tuyến"
          size="small"
          sx={{ 
            bgcolor: isDarkMode ? '#1b5e20' : '#e8f5e8',
            color: isDarkMode ? '#a5d6a7' : '#2e7d32',
            fontWeight: 600,
            fontSize: '0.8rem'
          }}
        />
      </Box>
    </Box>
  );
};

export default StatusBar; 