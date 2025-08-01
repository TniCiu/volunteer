import React from 'react';
import { Box, Chip, Typography, IconButton, Tooltip } from '@mui/material';
import { Wifi, WifiOff, Refresh } from '@mui/icons-material';
import { useSocket } from '../contexts/SocketContext';

const SocketStatus = () => {
  const { isConnected, socket, registrationUpdates } = useSocket();
  
  // Kiểm tra role của user
  const userRole = localStorage.getItem('role') || 'user';
  
  // Chỉ hiển thị cho admin
  if (userRole !== 'admin') {
    return null;
  }

  const handleReconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 20, 
      right: 20, 
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {/* Socket Connection Status */}
      <Chip
        icon={isConnected ? <Wifi /> : <WifiOff />}
        label={isConnected ? 'Real-time Connected' : 'Real-time Disconnected'}
        color={isConnected ? 'success' : 'error'}
        variant="outlined"
        sx={{ 
          fontWeight: 600,
          '& .MuiChip-icon': {
            color: isConnected ? 'success.main' : 'error.main'
          }
        }}
      />
      
      {/* Updates Counter */}
      {registrationUpdates.length > 0 && (
        <Chip
          label={`${registrationUpdates.length} updates received`}
          color="info"
          variant="outlined"
          size="small"
        />
      )}
      
      {/* Reconnect Button */}
      {!isConnected && (
        <Tooltip title="Reconnect">
          <IconButton
            onClick={handleReconnect}
            sx={{ 
              bgcolor: 'error.main', 
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' }
            }}
            size="small"
          >
            <Refresh />
          </IconButton>
        </Tooltip>
      )}
      
      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ 
          bgcolor: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          p: 1, 
          borderRadius: 1,
          fontSize: '12px',
          maxWidth: 200
        }}>
          <Typography variant="caption" display="block">
            Socket ID: {socket?.id || 'N/A'}
          </Typography>
          <Typography variant="caption" display="block">
            Updates: {registrationUpdates.length}
          </Typography>
          <Typography variant="caption" display="block">
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </Typography>
          <Typography variant="caption" display="block">
            Role: {userRole}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SocketStatus; 