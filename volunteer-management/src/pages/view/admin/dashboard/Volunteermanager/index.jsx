import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Avatar, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, CircularProgress, Tooltip, Divider,
  Badge, LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon, Search as SearchIcon, Add as AddIcon, Edit as EditIcon,
  Delete as DeleteIcon, Email as EmailIcon, Phone as PhoneIcon, 
  TrendingUp as TrendingUpIcon, Schedule as ScheduleIcon, 
  VerifiedUser as VerifiedUserIcon, Star as StarIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import AddVolunteer from './add';
import UpdateVolunteer from './update';
import { 
  getAllVolunteersAPI, 
  SignUpAPI, 
  updateUserInfoAPI, 
  deleteUserAPI
} from '../../../../../apis';

const VolunteerManager = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // Fetch volunteers from API
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await getAllVolunteersAPI();
      
      // Đảm bảo tất cả volunteers có đầy đủ các trường cần thiết
      const formattedVolunteers = data.map(volunteer => ({
        id: volunteer.id,
        name: volunteer.name || '',
        email: volunteer.email || '',
        phone: volunteer.phone || '',
        avatar: volunteer.avatar || null,
        role: volunteer.role || 'volunteer',
        status: volunteer.status || 'active',
        created_at: volunteer.created_at || new Date().toISOString(),
        updated_at: volunteer.updated_at || new Date().toISOString()
      }));
      
      setVolunteers(formattedVolunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi tải danh sách tình nguyện viên', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await deleteUserAPI(id);
        setVolunteers(volunteers.filter(v => v.id !== id));
        setSnackbar({ open: true, message: 'Xóa thành công!', severity: 'success' });
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        setSnackbar({ 
          open: true, 
          message: 'Lỗi khi xóa tình nguyện viên', 
          severity: 'error' 
        });
      }
    }
  };

  const handleEdit = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowUpdateForm(true);
  };

  const handleUpdateVolunteer = async (id, updatedData) => {
    try {
      // Đảm bảo status có giá trị mặc định nếu không có
      const dataWithStatus = {
        ...updatedData,
        status: updatedData.status || 'active'
      };
      const response = await updateUserInfoAPI(id, dataWithStatus);
      
      // Xử lý response từ API
      const updatedVolunteer = response.user || response;
      
      // Đảm bảo volunteer có đầy đủ các trường cần thiết
      const volunteerWithDefaults = {
        id: updatedVolunteer.id,
        name: updatedVolunteer.name || '',
        email: updatedVolunteer.email || '',
        phone: updatedVolunteer.phone || '',
        avatar: updatedVolunteer.avatar || null,
        role: updatedVolunteer.role || 'volunteer',
        status: updatedVolunteer.status || 'active',
        created_at: updatedVolunteer.created_at || new Date().toISOString(),
        updated_at: updatedVolunteer.updated_at || new Date().toISOString()
      };
      
      setVolunteers(prev => prev.map(v => v.id === id ? volunteerWithDefaults : v));
      setShowUpdateForm(false);
      setSelectedVolunteer(null);
      setSnackbar({ open: true, message: 'Cập nhật tình nguyện viên thành công!', severity: 'success' });
    } catch (error) {
      console.error('Error updating volunteer:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi cập nhật tình nguyện viên', 
        severity: 'error' 
      });
    }
  };

  const handleCloseUpdate = () => {
    setShowUpdateForm(false);
    setSelectedVolunteer(null);
  };

  const handleAddVolunteer = async (newVolunteerData) => {
    try {
      // Thêm trạng thái mặc định là "active" nếu không có
      const volunteerDataWithStatus = {
        ...newVolunteerData,
        status: newVolunteerData.status || 'active'
      };
      const response = await SignUpAPI(volunteerDataWithStatus);
      
      // Xử lý response từ API - có thể trả về { user: {...}, token: "..." }
      const createdVolunteer = response.user || response;
      
      // Đảm bảo volunteer có đầy đủ các trường cần thiết
      const volunteerWithDefaults = {
        id: createdVolunteer.id,
        name: createdVolunteer.name || '',
        email: createdVolunteer.email || '',
        phone: createdVolunteer.phone || '',
        avatar: createdVolunteer.avatar || null,
        role: createdVolunteer.role || 'volunteer',
        status: createdVolunteer.status || 'active',
        created_at: createdVolunteer.created_at || new Date().toISOString(),
        updated_at: createdVolunteer.updated_at || new Date().toISOString()
      };
      
      setVolunteers(prev => [...prev, volunteerWithDefaults]);
      setShowAddForm(false);
      setSnackbar({ open: true, message: 'Thêm tình nguyện viên thành công!', severity: 'success' });
    } catch (error) {
      console.error('Error creating volunteer:', error);
      
      // Lấy thông báo lỗi cụ thể từ backend
      let errorMessage = 'Lỗi khi thêm tình nguyện viên';
      
      if (error.response?.data?.message) {
        // Lấy message từ response của backend
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Lấy message từ error object
        errorMessage = error.message;
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  const handleBackToList = () => {
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#4caf50' : '#f44336';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Đang hoạt động' : 'Không hoạt động';
  };

  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.status === 'active').length;
  const totalHours = volunteers.reduce((sum, v) => sum + (v.totalHours || 0), 0);
  const avgRating = volunteers.reduce((sum, v) => sum + (v.rating || 0), 0) / volunteers.length;

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {showAddForm ? (
        <AddVolunteer 
          onBack={handleBackToList}
          onSave={handleAddVolunteer}
        />
      ) : showUpdateForm ? (
        <UpdateVolunteer
          volunteer={selectedVolunteer}
          onClose={handleCloseUpdate}
          onUpdate={handleUpdateVolunteer}
        />
      ) : (
        <>
          {/* Header with Stats */}
          <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight={100} sx={{ mb: 1 }}>
                  Quản lý Tình nguyện viên
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
                placeholder="Tìm kiếm tình nguyện viên theo tên, email..."
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
                 Thêm tình nguyện viên
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
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Tình nguyện viên</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thông tin liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Ngày tham gia</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%', 
                                bgcolor: getStatusColor(volunteer.status),
                                border: '2px solid white'
                              }} />
                            }
                          >
                            <Avatar 
                              sx={{ 
                                mr: 2, 
                                width: 50, 
                                height: 50,
                                border: '3px solid #e3f2fd'
                              }}
                              src={volunteer.avatar || undefined}
                              alt={volunteer.name}
                            >
                              {volunteer.name.charAt(0)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                              {volunteer.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {volunteer.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#1a237e' }} />
                            {volunteer.email}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#1a237e' }} />
                            {volunteer.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                                             <TableCell>
                         <Chip
                           label={getStatusText(volunteer.status)}
                           sx={{
                             bgcolor: getStatusColor(volunteer.status),
                             color: 'white',
                             fontWeight: 600,
                             '& .MuiChip-label': { px: 2 }
                           }}
                         />
                       </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(volunteer.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Chỉnh sửa thông tin">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(volunteer)}
                              sx={{ 
                                bgcolor: '#e3f2fd', 
                                color: '#1a237e',
                                '&:hover': { bgcolor: '#1a237e', color: 'white' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa tình nguyện viên">
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: '#ffebee', 
                                color: '#f44336',
                                '&:hover': { bgcolor: '#f44336', color: 'white' }
                              }}
                              onClick={() => handleDelete(volunteer.id)}
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
          
          {!loading && filteredVolunteers.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 6 }}>
              <PeopleIcon sx={{ fontSize: 80, color: '#1a237e', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                Không tìm thấy tình nguyện viên nào
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hãy thử tìm kiếm với từ khóa khác hoặc thêm tình nguyện viên mới
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
     
     {/* Snackbar for AddVolunteer component */}
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

export default VolunteerManager;
