import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, 
  Alert, Snackbar, CircularProgress, Tooltip, Avatar, Chip, 
  FormControl, Select, MenuItem
} from '@mui/material';
import {
  Event, Search, Edit, Delete, LocationOn, Person, 
  CheckCircle, Cancel, Pending, Info
} from '@mui/icons-material';
import { 
  getAllRegistrationsAPI, 
  updateRegistrationStatusAPI, 
  deleteRegistrationAPI
} from '../../../../../apis';
import { useSocket } from '../../../../../contexts/SocketContext';
import { formatDateTime, getRelativeTime, getCurrentDateISO } from '../../../../../utils/timeUtils';

const RegistrationManager = () => {
  const navigate = useNavigate();
  const { registrationUpdates } = useSocket();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: '', title: '' });

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await getAllRegistrationsAPI();
      const data = response.data || response;
      const formattedRegistrations = data.map(registration => ({
        id: registration.id,
        activity_id: registration.activity_id,
        user_id: registration.user_id,
        activity_title: registration.activity_title || 'N/A',
        activity_date: registration.activity_date || '',
        activity_location: registration.activity_location || '',
        activity_image: registration.activity_image || '',
        full_name: registration.full_name || '',
        phone: registration.phone || '',
        email: registration.email || '',
        birth_date: registration.birth_date || '',
        gender: registration.gender || '',
        address: registration.address || '',
        education_level: registration.education_level || '',
        school: registration.school || '',
        major: registration.major || '',
        occupation: registration.occupation || '',
        company: registration.company || '',
        experience: registration.experience || '',
        skills: registration.skills || '',
        participation_ability: registration.participation_ability || '',
        status: registration.status || 'pending',
        created_at: registration.created_at || getCurrentDateISO(),
        updated_at: registration.updated_at || getCurrentDateISO()
      }));
      setRegistrations(formattedRegistrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setSnackbar({ open: true, message: 'Lỗi khi tải danh sách đơn đăng ký', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  // Lắng nghe cập nhật trạng thái đăng ký real-time
  useEffect(() => {
    if (registrationUpdates.length > 0) {
      const latestUpdate = registrationUpdates[registrationUpdates.length - 1];
      
      // Cập nhật trạng thái trong danh sách đăng ký
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(registration => {
          if (registration.id == latestUpdate.registrationId) {
            return {
              ...registration,
              status: latestUpdate.status,
              updated_at: latestUpdate.timestamp
            };
          }
          return registration;
        })
      );
    }
  }, [registrationUpdates]);

  const uniqueActivities = [...new Set(registrations.map(reg => reg.activity_title))].filter(title => title && title !== 'N/A');

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.activity_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.activity_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivity = !selectedActivity || registration.activity_title === selectedActivity;
    return matchesSearch && matchesActivity;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn đăng ký này?')) {
      try {
        await deleteRegistrationAPI(id);
        setRegistrations(registrations.filter(r => r.id !== id));
        setSnackbar({ open: true, message: 'Xóa đơn đăng ký thành công!', severity: 'success' });
      } catch (error) {
        console.error('Error deleting registration:', error);
        setSnackbar({ open: true, message: 'Lỗi khi xóa đơn đăng ký', severity: 'error' });
      }
    }
  };

  const handleStatusChange = (registration) => {
    setSelectedRegistration(registration);
    setShowStatusDialog(true);
  };

  const handleUpdateStatus = async (status) => {
    try {
      await updateRegistrationStatusAPI(selectedRegistration.id, { status });
      setRegistrations(registrations.map(reg => 
        reg.id === selectedRegistration.id 
          ? { ...reg, status, updated_at: getCurrentDateISO() }
          : reg
      ));
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công!', severity: 'success' });
      setShowStatusDialog(false);
      setSelectedRegistration(null);
    } catch (error) {
      console.error('Error updating registration status:', error);
      setSnackbar({ open: true, message: 'Lỗi khi cập nhật trạng thái', severity: 'error' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatDateTime(dateString, 'DD/MM/YYYY HH:mm');
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'success', icon: <CheckCircle />, text: 'Đã duyệt', bgColor: '#e8f5e8', textColor: '#2e7d32' };
      case 'rejected':
        return { color: 'error', icon: <Cancel />, text: 'Từ chối', bgColor: '#ffebee', textColor: '#d32f2f' };
      case 'pending':
      default:
        return { color: 'warning', icon: <Pending />, text: 'Chờ duyệt', bgColor: '#fff3e0', textColor: '#f57c00' };
    }
  };

  const commonStyles = {
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
    background: 'white'
  };

  const statusCards = [
    { status: 'pending', title: 'Chờ duyệt', desc: 'Đơn đăng ký đang chờ xem xét', color: '#f57c00', bgColor: '#fff3e0', icon: <Pending /> },
    { status: 'approved', title: 'Duyệt', desc: 'Chấp nhận đơn đăng ký', color: '#2e7d32', bgColor: '#e8f5e8', icon: <CheckCircle /> },
    { status: 'rejected', title: 'Từ chối', desc: 'Từ chối đơn đăng ký', color: '#d32f2f', bgColor: '#ffebee', icon: <Cancel /> }
  ];

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
        <Typography variant="h5" fontWeight={100}>Quản lý Đơn đăng ký</Typography>
      </Box>

      {/* Search and Filter */}
      <Card sx={{ mb: 4, ...commonStyles }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm đơn đăng ký..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ 
                  startAdornment: <Search sx={{ color: '#1a237e', mr: 1 }} />,
                  sx: { borderRadius: 3, bgcolor: '#fafafa' }
                }}
              />
            </Grid>
                          <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <Select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    displayEmpty
                    sx={{ 
                      borderRadius: 3, 
                      bgcolor: '#fafafa',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1a237e',
                        borderWidth: '2px'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#0d47a1'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1a237e'
                      }
                    }}
                  >
                    <MenuItem value="">Tất cả hoạt động</MenuItem>
                    {uniqueActivities.map((activity) => (
                      <MenuItem key={activity} value={activity}>{activity}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
          </Grid>
          
          {(searchTerm || selectedActivity) && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e3f2fd' }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info sx={{ fontSize: 16, color: '#1a237e' }} />
                <strong>Bộ lọc hiện tại:</strong>
                {searchTerm && <Chip label={`Tìm kiếm: "${searchTerm}"`} size="small" color="primary" variant="outlined" sx={{ ml: 1 }} />}
                {selectedActivity && <Chip label={`Hoạt động: ${selectedActivity}`} size="small" color="secondary" variant="outlined" sx={{ ml: 1 }} />}
                <Chip label={`${filteredRegistrations.length} kết quả`} size="small" color="success" variant="outlined" sx={{ ml: 1 }} />
                <Button size="small" onClick={() => { setSearchTerm(''); setSelectedActivity(''); }} sx={{ ml: 1, color: '#1a237e' }}>
                  Xóa bộ lọc
                </Button>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card sx={commonStyles}>
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
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thông tin cá nhân</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Học vấn & Công việc</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Kinh nghiệm & Kỹ năng</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Khả năng tham gia</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Ngày đăng ký</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRegistrations.map((registration) => {
                    const statusInfo = getStatusInfo(registration.status);
                    return (
                      <TableRow key={registration.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            {registration.activity_image ? (
                              <Box
                                component="img"
                                src={registration.activity_image}
                                alt={registration.activity_title}
                                onClick={() => { setSelectedImage({ src: registration.activity_image, title: registration.activity_title }); setShowImageDialog(true); }}
                                sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', border: '2px solid #e3f2fd', cursor: 'pointer' }}
                              />
                            ) : (
                              <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e3f2fd' }}>
                                <Event sx={{ color: '#1a237e', fontSize: 24 }} />
                              </Box>
                            )}
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} color="#1a237e">{registration.activity_title}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />{registration.activity_location}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 50, height: 50, border: '3px solid #e3f2fd', bgcolor: '#1a237e' }}>
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} color="#1a237e">{registration.full_name}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{registration.email}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{registration.phone}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{registration.gender} • {formatDateTime(registration.birth_date, 'DD/MM/YYYY')}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{registration.address}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}><strong>Học vấn:</strong> {registration.education_level}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}><strong>Trường:</strong> {registration.school}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}><strong>Chuyên ngành:</strong> {registration.major}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}><strong>Nghề nghiệp:</strong> {registration.occupation}</Typography>
                          {registration.company && registration.company !== 'không có' && (
                            <Typography variant="body2" color="text.secondary"><strong>Công ty:</strong> {registration.company}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}><strong>Kinh nghiệm:</strong></Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            {registration.experience.length > 50 ? `${registration.experience.substring(0, 50)}...` : registration.experience}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}><strong>Kỹ năng:</strong></Typography>
                          <Typography variant="caption" color="text.secondary">
                            {registration.skills.length > 50 ? `${registration.skills.substring(0, 50)}...` : registration.skills}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{registration.participation_ability}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusInfo.icon}
                            label={statusInfo.text}
                            color={statusInfo.color}
                            size="small"
                            sx={{ fontWeight: 600, bgcolor: statusInfo.bgColor, color: statusInfo.textColor }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}><strong>Đăng ký:</strong> {formatDate(registration.created_at)}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{getRelativeTime(registration.created_at)}</Typography>
                          {registration.updated_at && registration.updated_at !== registration.created_at && (
                            <>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}><strong>Cập nhật:</strong> {formatDate(registration.updated_at)}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{getRelativeTime(registration.updated_at)}</Typography>
                            </>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="Thay đổi trạng thái">
                              <IconButton size="small" onClick={() => handleStatusChange(registration)} sx={{ bgcolor: '#e3f2fd', color: '#1a237e', '&:hover': { bgcolor: '#1a237e', color: 'white' } }}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa đơn đăng ký">
                              <IconButton size="small" onClick={() => handleDelete(registration.id)} sx={{ bgcolor: '#ffebee', color: '#f44336', '&:hover': { bgcolor: '#f44336', color: 'white' } }}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {!loading && filteredRegistrations.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 6 }}>
              <Person sx={{ fontSize: 80, color: '#1a237e', mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>Không tìm thấy đơn đăng ký nào</Typography>
              <Typography variant="body1" color="text.secondary">Hãy thử tìm kiếm với từ khóa khác</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onClose={() => { setShowStatusDialog(false); setSelectedRegistration(null); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', color: 'white', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>Thay đổi trạng thái đơn đăng ký</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {/* User Info */}
          <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', borderRadius: 3, border: '2px solid #e3f2fd' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 60, height: 60, border: '3px solid #1a237e', bgcolor: '#1a237e' }}>
                  <Person sx={{ fontSize: 30 }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600} color="#1a237e" sx={{ mb: 1 }}>{selectedRegistration?.full_name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>📧 {selectedRegistration?.email}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>📱 {selectedRegistration?.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">🎯 {selectedRegistration?.activity_title}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={600} color="#1a237e" sx={{ mb: 2 }}>Trạng thái hiện tại</Typography>
            <Chip
              icon={getStatusInfo(selectedRegistration?.status).icon}
              label={getStatusInfo(selectedRegistration?.status).text}
              color={getStatusInfo(selectedRegistration?.status).color}
              size="large"
              sx={{ fontWeight: 600, fontSize: '1rem', height: 40, bgcolor: getStatusInfo(selectedRegistration?.status).bgColor, color: getStatusInfo(selectedRegistration?.status).textColor }}
            />
          </Box>

          {/* Status Options */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={600} color="#1a237e" sx={{ mb: 3 }}>Chọn trạng thái mới</Typography>
            <Grid container spacing={2}>
              {statusCards.map((card) => (
                <Grid item xs={12} md={4} key={card.status}>
                  <Card 
                    onClick={() => handleUpdateStatus(card.status)}
                    sx={{ 
                      cursor: 'pointer', transition: 'all 0.3s ease', border: '2px solid #1a237e', borderRadius: 3,
                      height: '100%', width: '250px', display: 'flex', flexDirection: 'column',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(26, 35, 126, 0.3)', borderColor: '#0d47a1' }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 160 }}>
                      <Box sx={{ 
                        width: 50, height: 50, borderRadius: '50%', bgcolor: card.bgColor, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: `2px solid ${card.color}`
                      }}>
                        {React.cloneElement(card.icon, { sx: { fontSize: 25, color: card.color } })}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ color: card.color, mb: 1 }}>{card.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>{card.desc}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info sx={{ fontSize: 16, color: '#1a237e' }} />
              <strong>Lưu ý:</strong> Thay đổi trạng thái sẽ được gửi thông báo đến người đăng ký
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          <Button onClick={() => { setShowStatusDialog(false); setSelectedRegistration(null); }} variant="outlined" sx={{ borderColor: '#1a237e', color: '#1a237e' }}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={showImageDialog} onClose={() => { setShowImageDialog(false); setSelectedImage({ src: '', title: '' }); }} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', color: 'white' }}>
          <Typography variant="h6">{selectedImage.title}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box component="img" src={selectedImage.src} alt={selectedImage.title} sx={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }} />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegistrationManager; 