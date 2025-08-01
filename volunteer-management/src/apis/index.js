import axios from 'axios'
import { API_BASE_URL } from '../utils/constans';

// Tạo axios instance với interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor để tự động thêm token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi authentication
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

export const SignUpAPI = async (data) => {
  try {
    const response = await apiClient.post(`/v1/users`, data);
    
    if (response.data.error || response.data.message?.includes('đã tồn tại')) {
      throw new Error(response.data.error || response.data.message);
    }
    
    return response.data;
  } catch (error) {
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw error;
  }
}

export const loginAPI = async (data) => {
  const response = await apiClient.post(`/v1/users/login`, data);
  return response.data;
}

export const fetchUserInfoAPI = async (Ids) => {
  const response = await apiClient.get(`/v1/users/${Ids}`);
  return response.data;
}
export const getAllVolunteersAPI = async () => {
  const response = await apiClient.get(`/v1/users/volunteers`);
  return response.data;
}
export const getAllLeadersAndAdminsAPI = async () => {
  const response = await apiClient.get(`/v1/users/leaders-admins`);
  return response.data;
}

export const updateUserInfoAPI = async (id, data) => {
  const response = await apiClient.put(`/v1/users/${id}`, data);
  return response.data;
}
export const deleteUserAPI = async (id) => {
  const response = await apiClient.delete(`/v1/users/${id}`);
  return response.data;
}
// Activities APIs
export const getAllActivitiesAPI = async (userId = null) => {
  const params = userId ? { userId } : {};
  const response = await apiClient.get(`/v1/activities`, { params });
  return response.data;
}

export const getActivityByIdAPI = async (id) => {
  const response = await apiClient.get(`/v1/activities/${id}`);
  return response.data;
}

export const createActivityAPI = async (data) => {
  const response = await apiClient.post(`/v1/activities`, data);
  return response.data;
}

export const updateActivityAPI = async (id, data) => {
  const response = await apiClient.put(`/v1/activities/${id}`, data);
  return response.data;
}

export const deleteActivityAPI = async (id) => {
  const response = await apiClient.delete(`/v1/activities/${id}`);
  return response.data;
}

export const joinActivityAPI = async (activityId, userId) => {
  const response = await apiClient.post(`/v1/activities/${activityId}/join`, { userId });
  return response.data;
}

export const leaveActivityAPI = async (activityId, userId) => {
  const response = await apiClient.post(`/v1/activities/${activityId}/leave`, { userId });
  return response.data;
}

// Tags APIs
export const getAllTagsAPI = async () => {
  const response = await apiClient.get(`/v1/tags`);
  return response.data;
}

export const getTagByIdAPI = async (id) => {
  const response = await apiClient.get(`/v1/tags/${id}`);
  return response.data;
}

export const createTagAPI = async (data) => {
  const response = await apiClient.post(`/v1/tags`, data);
  return response.data;
}

export const updateTagAPI = async (id, data) => {
  const response = await apiClient.put(`/v1/tags/${id}`, data);
  return response.data;
}

export const deleteTagAPI = async (id) => {
  const response = await apiClient.delete(`/v1/tags/${id}`);
  return response.data;
}

// Activity Registration APIs
export const createActivityRegistrationAPI = async (data) => {
  const response = await apiClient.post(`/v1/activity-registrations`, data);
  return response.data;
}

export const getActivityRegistrationByIdAPI = async (id) => {
  const response = await apiClient.get(`/v1/activity-registrations/${id}`);
  return response.data;
}

export const getActivityRegistrationsByActivityIdAPI = async (activityId) => {
  const response = await apiClient.get(`/v1/activity-registrations/activity/${activityId}`);
  return response.data;
}

export const getActivityRegistrationsByUserIdAPI = async (userId) => {
  const response = await apiClient.get(`/v1/activity-registrations/user/${userId}`);
  return response.data;
}

export const updateActivityRegistrationStatusAPI = async (id, status) => {
  const response = await apiClient.put(`/v1/activity-registrations/${id}/status`, { status });
  return response.data;
}

export const deleteActivityRegistrationAPI = async (id) => {
  const response = await apiClient.delete(`/v1/activity-registrations/${id}`);
  return response.data;
}

export const checkUserActivityRegistrationAPI = async (activityId) => {
  const response = await apiClient.get(`/v1/activity-registrations/check/${activityId}`);
  return response.data;
}

// Activity Registration APIs - New endpoints
export const getActivityRegistrationsAPI = async (activityId, status = null) => {
  const params = status ? { status } : {};
  const response = await apiClient.get(`/v1/activities/${activityId}/registrations`, { params });
  return response.data;
}

export const getActivityRegistrationStatsAPI = async (activityId) => {
  const response = await apiClient.get(`/v1/activities/${activityId}/registration-stats`);
  return response.data;
}

// Registration Manager APIs
export const getAllRegistrationsAPI = async () => {
  const response = await apiClient.get(`/v1//activity-registrations`);
  return response.data;
}

export const updateRegistrationStatusAPI = async (id, data) => {
  const response = await apiClient.put(`/v1/activity-registrations/${id}/status`, data);
  return response.data;
}

export const deleteRegistrationAPI = async (id) => {
  const response = await apiClient.delete(`/v1/activity-registrations/${id}`);
  return response.data;
}

// Notification APIs
export const getRegistrationNotificationsAPI = async () => {
  const response = await apiClient.get(`/v1/notifications/registrations`);
  return response.data;
}

export const markNotificationAsReadAPI = async (notificationId) => {
  const response = await apiClient.put(`/v1/notifications/registrations/${notificationId}/read`);
  return response.data;
}

// Statistics APIs
export const getStatisticsAPI = async () => {
  const response = await apiClient.get(`/v1/statistics`);
  return response.data;
}

export const getDetailedStatisticsAPI = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.role) params.append('role', filters.role);
  
  const response = await apiClient.get(`/v1/statistics/detailed?${params.toString()}`);
  return response.data;
}