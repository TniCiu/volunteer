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
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as LeaderIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import AddLeaderForm from './add';
import UpdateLeaderForm from './update';
import { 
  getAllLeadersAndAdminsAPI, 
  SignUpAPI, 
  updateUserInfoAPI, 
  deleteUserAPI 
} from '../../../../../apis';

const LeaderManager = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);

  // Fetch leaders and admins from API
  const fetchLeaders = async () => {
    try {
      setLoading(true);
      const data = await getAllLeadersAndAdminsAPI();
      
      // Đảm bảo tất cả leaders có đầy đủ các trường cần thiết
      const formattedLeaders = data.map(leader => ({
        id: leader.id,
        name: leader.name || '',
        email: leader.email || '',
        phone: leader.phone || '',
        avatar: leader.avatar || null,
        role: leader.role || 'leader',
        status: leader.status || 'active',
        created_at: leader.created_at || new Date().toISOString(),
        updated_at: leader.updated_at || new Date().toISOString()
      }));
      
      setLeaders(formattedLeaders);
    } catch (error) {
      console.error('Error fetching leaders:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi tải danh sách quản lý nội bộ', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const filteredLeaders = leaders
    .filter(leader =>
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sắp xếp theo thứ tự: admin trước, leader sau
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      // Nếu cùng role thì sắp xếp theo tên
      return a.name.localeCompare(b.name);
    });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await deleteUserAPI(id);
        setLeaders(leaders.filter(l => l.id !== id));
        setSnackbar({ open: true, message: 'Xóa thành công!', severity: 'success' });
      } catch (error) {
        console.error('Error deleting leader:', error);
        setSnackbar({ 
          open: true, 
          message: 'Lỗi khi xóa quản lý nội bộ', 
          severity: 'error' 
        });
      }
    }
  };

  const handleEdit = (leader) => {
    setSelectedLeader(leader);
    setShowUpdateForm(true);
  };

  const handleUpdateLeader = async (id, updatedData) => {
    try {
      // Đảm bảo status có giá trị mặc định nếu không có
      const dataWithStatus = {
        ...updatedData,
        status: updatedData.status || 'active'
      };
      const response = await updateUserInfoAPI(id, dataWithStatus);
      
      // Xử lý response từ API
      const updatedLeader = response.user || response;
      
      // Đảm bảo leader có đầy đủ các trường cần thiết
      const leaderWithDefaults = {
        id: updatedLeader.id,
        name: updatedLeader.name || '',
        email: updatedLeader.email || '',
        phone: updatedLeader.phone || '',
        avatar: updatedLeader.avatar || null,
        role: updatedLeader.role || 'leader',
        status: updatedLeader.status || 'active',
        created_at: updatedLeader.created_at || new Date().toISOString(),
        updated_at: updatedLeader.updated_at || new Date().toISOString()
      };
      
      setLeaders(prev => prev.map(l => l.id === id ? leaderWithDefaults : l));
      setShowUpdateForm(false);
      setSelectedLeader(null);
      setSnackbar({ open: true, message: 'Cập nhật quản lý nội bộ thành công!', severity: 'success' });
    } catch (error) {
      console.error('Error updating leader:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi cập nhật quản lý nội bộ', 
        severity: 'error' 
      });
    }
  };

  const handleCloseUpdate = () => {
    setShowUpdateForm(false);
    setSelectedLeader(null);
  };

  const handleAddLeader = async (newLeaderData) => {
    try {
      // Thêm trạng thái mặc định là "active" nếu không có
      const leaderDataWithStatus = {
        ...newLeaderData,
        status: newLeaderData.status || 'active'
      };
      const response = await SignUpAPI(leaderDataWithStatus);
      
      // Xử lý response từ API - có thể trả về { user: {...}, token: "..." }
      const createdLeader = response.user || response;
      
      // Đảm bảo leader có đầy đủ các trường cần thiết
      const leaderWithDefaults = {
        id: createdLeader.id,
        name: createdLeader.name || '',
        email: createdLeader.email || '',
        phone: createdLeader.phone || '',
        avatar: createdLeader.avatar || null,
        role: createdLeader.role || 'leader',
        status: createdLeader.status || 'active',
        created_at: createdLeader.created_at || new Date().toISOString(),
        updated_at: createdLeader.updated_at || new Date().toISOString()
      };
      
      setLeaders(prev => [...prev, leaderWithDefaults]);
      setShowAddForm(false);
      setSnackbar({ open: true, message: 'Thêm quản lý nội bộ thành công!', severity: 'success' });
    } catch (error) {
      console.error('Error creating leader:', error);
      
      // Lấy thông báo lỗi cụ thể từ backend
      let errorMessage = 'Lỗi khi thêm quản lý nội bộ';
      
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

  const getRoleColor = (role) => {
    return role === 'admin' ? '#d32f2f' : '#1976d2';
  };

  const getRoleText = (role) => {
    return role === 'admin' ? 'Quản trị viên' : 'Trưởng nhóm';
  };

  const getRoleIcon = (role) => {
    return role === 'admin' ? <AdminIcon /> : <LeaderIcon />;
  };

  const totalLeaders = leaders.length;
  const activeLeaders = leaders.filter(l => l.status === 'active').length;
  const totalHours = leaders.reduce((sum, l) => sum + (l.totalHours || 0), 0);
  const avgRating = leaders.reduce((sum, l) => sum + (l.rating || 0), 0) / leaders.length;

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {showAddForm ? (
        <AddLeaderForm 
          onBack={handleBackToList}
          onSave={handleAddLeader}
        />
      ) : showUpdateForm ? (
        <UpdateLeaderForm
          leader={selectedLeader}
          onClose={handleCloseUpdate}
          onUpdate={handleUpdateLeader}
        />
      ) : (
        <>
          {/* Header with Stats */}
          <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight={100} sx={{ mb: 1 }}>
                  Quản lý Nội bộ
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
                placeholder="Tìm kiếm quản lý nội bộ theo tên, email..."
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
                 Thêm quản lý nội bộ
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
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Quản lý nội bộ</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thông tin liên hệ</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Vai trò</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Ngày tham gia</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                <TableBody>
                  {filteredLeaders.map((leader) => (
                    <TableRow key={leader.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
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
                                bgcolor: getStatusColor(leader.status),
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
                              src={leader.avatar || undefined}
                              alt={leader.name}
                            >
                              {leader.name.charAt(0)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                              {leader.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {leader.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#1a237e' }} />
                            {leader.email}
                          </Typography>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#1a237e' }} />
                            {leader.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getRoleIcon(leader.role)}
                          label={getRoleText(leader.role)}
                          sx={{
                            bgcolor: getRoleColor(leader.role),
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 2 }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(leader.status)}
                          sx={{
                            bgcolor: getStatusColor(leader.status),
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 2 }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(leader.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Chỉnh sửa thông tin">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEdit(leader)}
                              sx={{ 
                                bgcolor: '#e3f2fd', 
                                color: '#1a237e',
                                '&:hover': { bgcolor: '#1a237e', color: 'white' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa quản lý nội bộ">
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: '#ffebee', 
                                color: '#f44336',
                                '&:hover': { bgcolor: '#f44336', color: 'white' }
                              }}
                              onClick={() => handleDelete(leader.id)}
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
          
          {!loading && filteredLeaders.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 6 }}>
              <PeopleIcon sx={{ fontSize: 80, color: '#1a237e', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                Không tìm thấy quản lý nội bộ nào
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hãy thử tìm kiếm với từ khóa khác hoặc thêm quản lý nội bộ mới
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
     
     {/* Snackbar for AddLeaderForm component */}
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

export default LeaderManager; 