import React from 'react';
import { 
  formatDate, 
  formatDateTime, 
  getRelativeTime, 
  getTimeUntilEvent, 
  formatEventDuration,
  isPast,
  isFuture,
  isToday
} from '../utils/timeUtils';
import { Box, Typography, Chip } from '@mui/material';

const EventTimeDisplay = ({ event }) => {
  const {
    startDate,
    endDate,
    title,
    description
  } = event;

  const getStatusColor = () => {
    if (isPast(startDate)) return 'error';
    if (isToday(startDate)) return 'warning';
    if (isFuture(startDate)) return 'success';
    return 'default';
  };

  const getStatusText = () => {
    if (isPast(startDate)) return 'Đã diễn ra';
    if (isToday(startDate)) return 'Hôm nay';
    if (isFuture(startDate)) return 'Sắp diễn ra';
    return 'Không xác định';
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip 
          label={getStatusText()} 
          color={getStatusColor()} 
          size="small" 
        />
        <Chip 
          label={getTimeUntilEvent(startDate)} 
          variant="outlined" 
          size="small" 
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2">
          <strong>Thời gian diễn ra:</strong> {formatEventDuration(startDate, endDate)}
        </Typography>
        
        <Typography variant="body2">
          <strong>Ngày bắt đầu:</strong> {formatDateTime(startDate)}
        </Typography>
        
        <Typography variant="body2">
          <strong>Ngày kết thúc:</strong> {formatDateTime(endDate)}
        </Typography>
        
        <Typography variant="body2">
          <strong>Thời gian tương đối:</strong> {getRelativeTime(startDate)}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventTimeDisplay; 