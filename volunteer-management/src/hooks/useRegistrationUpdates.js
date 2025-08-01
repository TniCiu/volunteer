import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

export const useRegistrationUpdates = (activityId = null) => {
  const { registrationUpdates } = useSocket();
  const [localUpdates, setLocalUpdates] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (registrationUpdates.length > 0) {
      const latestUpdate = registrationUpdates[registrationUpdates.length - 1];
      
      // Nếu có activityId, chỉ lọc updates liên quan
      if (activityId) {
        if (latestUpdate.activityId == activityId) {
          setLocalUpdates(prev => [...prev, latestUpdate]);
          setLastUpdate(latestUpdate);
        }
      } else {
        // Nếu không có activityId, lấy tất cả updates
        setLocalUpdates(registrationUpdates);
        setLastUpdate(latestUpdate);
      }
    }
  }, [registrationUpdates, activityId]);

  // Cleanup old updates (keep only last 5)
  useEffect(() => {
    if (localUpdates.length > 5) {
      setLocalUpdates(prev => prev.slice(-5));
    }
  }, [localUpdates]);

  const getStatusText = useCallback((status) => {
    switch (status) {
      case 'approved':
        return 'đã được duyệt';
      case 'rejected':
        return 'đã bị từ chối';
      case 'pending':
        return 'đang chờ duyệt';
      default:
        return 'đã cập nhật';
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  }, []);

  const clearUpdates = useCallback(() => {
    setLocalUpdates([]);
    setLastUpdate(null);
  }, []);

  return {
    updates: localUpdates,
    lastUpdate,
    getStatusText,
    getStatusColor,
    clearUpdates,
    hasUpdates: localUpdates.length > 0
  };
}; 