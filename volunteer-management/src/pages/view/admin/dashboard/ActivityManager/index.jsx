import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, CircularProgress, Tooltip, Divider,
  Badge, LinearProgress, Avatar, Chip
} from '@mui/material';
import {
  Event as EventIcon, Search as SearchIcon, Add as AddIcon, Edit as EditIcon,
  Delete as DeleteIcon, LocationOn as LocationIcon, 
  People as PeopleIcon, Schedule as ScheduleIcon, 
  TrendingUp as TrendingUpIcon, Star as StarIcon, Image as ImageIcon
} from '@mui/icons-material';
import AddActivity from './add';
import UpdateActivity from './update';
import { 
  getAllActivitiesAPI, 
  createActivityAPI, 
  updateActivityAPI, 
  deleteActivityAPI,
  getAllLeadersAndAdminsAPI
} from '../../../../../apis';
// Import time utilities
import { 
  formatDateTime, 
  getRelativeTime, 
  getTimeUntilEvent,
  isPast,
  isFuture,
  isToday,
  getCurrentDateISO
} from '../../../../../utils/timeUtils';

const ActivityManager = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Fetch activities from API
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getAllActivitiesAPI();
      
      // Đảm bảo tất cả activities có đầy đủ các trường cần thiết
      const formattedActivities = data.map(activity => ({
        id: activity.id,
        title: activity.title || '',
        slogan: activity.slogan || '',
        date: activity.date || '',
        time: activity.time || '',
        participants_current: activity.participants_current || 0,
        participants_max: activity.participants_max || 0,
        participants_percentage: activity.participants_percentage || 0,
        location: activity.location || '',
        address: activity.address || '',
        description: activity.description || '',
        image: activity.image || '',
        timeline: activity.timeline || [],
        leader_id: activity.leader_id || null,
        created_at: activity.created_at || getCurrentDateISO(),
        updated_at: activity.updated_at || getCurrentDateISO(),
        tags: activity.tags || [],
        leader: activity.leader || null,
        registrations: activity.registrations || []
      }));
      
      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi tải danh sách hoạt động', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter(activity =>
    activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.slogan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
      try {
        await deleteActivityAPI(id);
        setActivities(activities.filter(a => a.id !== id));
        setSnackbar({ open: true, message: 'Xóa hoạt động thành công!', severity: 'success' });
      } catch (error) {
        console.error('Error deleting activity:', error);
        setSnackbar({ 
          open: true, 
          message: 'Lỗi khi xóa hoạt động', 
          severity: 'error' 
        });
      }
    }
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setShowUpdateForm(true);
  };

  const handleUpdateActivity = async (id, updatedData) => {
    try {
      console.log('Updating activity with data:', updatedData);
      const response = await updateActivityAPI(id, updatedData);
      console.log('Update response:', response);
      
      // Đảm bảo cập nhật đầy đủ dữ liệu từ response
      const updatedActivity = {
        id: response.id,
        title: response.title,
        slogan: response.slogan,
        date: response.date,
        time: response.time,
        participants_current: response.participants_current || 0,
        participants_max: response.participants_max || 0,
        participants_percentage: response.participants_percentage || 0,
        location: response.location,
        address: response.address,
        description: response.description,
        image: response.image,
        timeline: response.timeline || [],
        leader_id: response.leader_id,
        created_at: response.created_at || getCurrentDateISO(),
        updated_at: response.updated_at || getCurrentDateISO(),
        tags: response.tags || [],
        leader: response.leader || null,
        registrations: response.registrations || []
      };
      
      // Kiểm tra xem response có đầy đủ dữ liệu không
      if (response.leader || response.tags) {
        // Nếu có dữ liệu đầy đủ, cập nhật trực tiếp
        setActivities(activities.map(activity => 
          activity.id === id ? updatedActivity : activity
        ));
      } else {
        // Nếu không đầy đủ, fetch lại toàn bộ danh sách
        await fetchActivities();
      }
      
      setSnackbar({ open: true, message: 'Cập nhật hoạt động thành công!', severity: 'success' });
      setShowUpdateForm(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error('Error updating activity:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi cập nhật hoạt động', 
        severity: 'error' 
      });
    }
  };

  const handleCloseUpdate = () => {
    setShowUpdateForm(false);
    setSelectedActivity(null);
  };

  const handleAddActivity = async (newActivityData) => {
    try {
      const response = await createActivityAPI(newActivityData);
      const newActivity = {
        id: response.id,
        title: response.title,
        slogan: response.slogan,
        date: response.date,
        time: response.time,
        participants_current: response.participants_current || 0,
        participants_max: response.participants_max || 0,
        participants_percentage: response.participants_percentage || 0,
        location: response.location,
        address: response.address,
        description: response.description,
        image: response.image,
        timeline: response.timeline || [],
        leader_id: response.leader_id,
        created_at: response.created_at || getCurrentDateISO(),
        updated_at: response.updated_at || getCurrentDateISO(),
        tags: response.tags || [],
        leader: response.leader || null,
        registrations: response.registrations || []
      };
      // Kiểm tra xem response có đầy đủ dữ liệu không
      if (response.leader || response.tags) {
        // Nếu có dữ liệu đầy đủ, thêm trực tiếp
        setActivities([...activities, newActivity]);
      } else {
        // Nếu không đầy đủ, fetch lại toàn bộ danh sách
        await fetchActivities();
      }
      
      setSnackbar({ open: true, message: 'Thêm hoạt động thành công!', severity: 'success' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding activity:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi thêm hoạt động', 
        severity: 'error' 
      });
    }
  };

  const handleBackToList = () => {
    setShowAddForm(false);
    setShowUpdateForm(false);
    setSelectedActivity(null);
  };

  // Format date using dayjs
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDateTime(dateString, 'DD/MM/YYYY HH:mm');
  };

  // Get relative time for created/updated dates
  const getRelativeTimeForDate = (dateString) => {
    if (!dateString) return 'N/A';
    return getRelativeTime(dateString);
  };





  if (showAddForm) {
    return <AddActivity onBack={handleBackToList} onSave={handleAddActivity} />;
  }

  if (showUpdateForm && selectedActivity) {
    return (
      <UpdateActivity 
        activity={selectedActivity} 
        onClose={handleCloseUpdate} 
        onUpdate={handleUpdateActivity} 
      />
    );
  }

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {showAddForm ? (
        <AddActivity 
          onBack={handleBackToList}
          onSave={handleAddActivity}
        />
      ) : showUpdateForm ? (
        <UpdateActivity
          activity={selectedActivity}
          onClose={handleCloseUpdate}
          onUpdate={handleUpdateActivity}
        />
      ) : (
        <>
          {/* Header with Stats */}
          <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight={100} sx={{ mb: 1 }}>
                  Quản lý Hoạt động
                </Typography>
              </Grid>
            </Grid>
          </Box>
  
          {/* Search & Add Section */}
          <Card sx={{ mb: 4, background: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm hoạt động theo tên, slogan, địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ 
                      startAdornment: <SearchIcon sx={{ color: '#1a237e', mr: 1 }} />,
                      sx: { 
                        borderRadius: 3,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e',
                        }
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: '#fafafa',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      } 
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                    onClick={() => setShowAddForm(true)}
                    sx={{
                      bgcolor: '#1a237e',
                      borderRadius: 2,
                      py: 1.2,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(26, 35, 126, 0.2)',
                      '&:hover': { 
                        bgcolor: '#3949ab',
                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Thêm hoạt động
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
  
          {/* Table Section */}
          <Card sx={{ background: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)' }}>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                  <CircularProgress sx={{ color: '#1a237e' }} size={60} />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                                         <TableHead>
                       <TableRow sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)' }}>
                         <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Hoạt động</TableCell>
                         <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thời gian & Địa điểm</TableCell>
                         <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Trưởng nhóm</TableCell>
                         <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Timeline</TableCell>
                         <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Người tham gia</TableCell>
                         <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Ngày tạo & Cập nhật</TableCell>
                         <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thao tác</TableCell>
                       </TableRow>
                     </TableHead>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {activity.image ? (
                                <Avatar 
                                  src={activity.image}
                                  sx={{ 
                                    mr: 2, 
                                    width: 50, 
                                    height: 50,
                                    border: '3px solid #e3f2fd'
                                  }}
                                />
                              ) : (
                                <Avatar 
                                  sx={{ 
                                    mr: 2, 
                                    width: 50, 
                                    height: 50,
                                    border: '3px solid #e3f2fd', 
                                    bgcolor: '#1a237e'
                                  }}
                                >
                                  <EventIcon />
                                </Avatar>
                              )}
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                                  {activity.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.slogan}
                                </Typography>
                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {activity.tags && activity.tags.map((tag) => (
                                    <Chip
                                      key={tag.id}
                                      label={tag.name}
                                      size="small"
                                      sx={{ 
                                        bgcolor: '#e3f2fd',
                                        color: '#1a237e',
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                  ))}
                                 
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {activity.date}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {activity.time}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                {activity.location}
                              </Typography>
                            </Box>
                          </TableCell>
                                                     <TableCell>
                             <Box>
                                                               {activity.leader ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                   {activity.leader.avatar ? (
                                     <Avatar 
                                       src={activity.leader.avatar}
                                       sx={{ 
                                         width: 32, 
                                         height: 32, 
                                         mr: 1.5
                                       }}
                                     />
                                   ) : (
                                     <Avatar 
                                       sx={{ 
                                         width: 32, 
                                         height: 32, 
                                         mr: 1.5,
                                         bgcolor: '#1a237e',
                                         fontSize: '0.8rem'
                                       }}
                                     >
                                       {activity.leader.name.charAt(0).toUpperCase()}
                                     </Avatar>
                                   )}
                                                                       <Box sx={{ minWidth: 0, flex: 1 }}>
                                      <Typography 
                                        variant="body2" 
                                        fontWeight={500} 
                                        color="#1a237e" 
                                        sx={{ 
                                          lineHeight: 1.2,
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'
                                        }}
                                      >
                                        {activity.leader.name}
                                      </Typography>
                                    </Box>
                                 </Box>
                               ) : (
                                 <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                   Chưa phân công
                                 </Typography>
                               )}
                             </Box>
                           </TableCell>
                          <TableCell>
                            <Box>
                              {activity.timeline && activity.timeline.length > 0 ? (
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    <strong>{activity.timeline.length} timeline items</strong>
                                  </Typography>
                                  {activity.timeline.slice(0, 2).map((item, index) => (
                                    <Box key={index} sx={{ mb: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ScheduleIcon sx={{ fontSize: 12, mr: 0.5 }} />
                                        {item.day} - {item.time}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                        {item.activity.length > 30 ? `${item.activity.substring(0, 30)}...` : item.activity}
                                      </Typography>
                                    </Box>
                                  ))}
                                  {activity.timeline.length > 2 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                      +{activity.timeline.length - 2} more...
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                                                 <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                   Không có timeline
                                 </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.participants_current}/{activity.participants_max}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={activity.participants_percentage} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  bgcolor: '#e3f2fd',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: activity.participants_percentage >= 100 ? '#ff9800' : '#4caf50'
                                  }
                                }} 
                              />
                                                               <Typography variant="caption" color="text.secondary">
                                   {activity.participants_percentage}% đã đăng ký
                                 </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <strong>Tạo:</strong> {formatDate(activity.created_at)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {getRelativeTimeForDate(activity.created_at)}
                              </Typography>
                              {activity.updated_at && activity.updated_at !== activity.created_at && (
                                <>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>
                                    <strong>Cập nhật:</strong> {formatDate(activity.updated_at)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {getRelativeTimeForDate(activity.updated_at)}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Chỉnh sửa thông tin">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEdit(activity)}
                                  sx={{ 
                                    bgcolor: '#e3f2fd', 
                                    color: '#1a237e',
                                    '&:hover': { bgcolor: '#1a237e', color: 'white' }
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa hoạt động">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#ffebee', 
                                    color: '#f44336',
                                    '&:hover': { bgcolor: '#f44336', color: 'white' }
                                  }}
                                  onClick={() => handleDelete(activity.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {!loading && filteredActivities.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 6 }}>
                  <EventIcon sx={{ fontSize: 80, color: '#1a237e', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                    Không tìm thấy hoạt động nào
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Hãy thử tìm kiếm với từ khóa khác hoặc thêm hoạt động mới
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
  
          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSnackbar({ ...snackbar, open: false })} 
              severity={snackbar.severity}
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': { fontSize: 24 }
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
      
      {/* Snackbar for AddActivity component */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 24 }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityManager; 