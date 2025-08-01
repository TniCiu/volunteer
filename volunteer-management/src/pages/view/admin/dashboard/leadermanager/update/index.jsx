import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar,
  IconButton, Alert, Snackbar, CircularProgress, Divider,
  InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Save as SaveIcon, 
  PhotoCamera as PhotoCameraIcon, Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon, Person as PersonIcon,
  Email as EmailIcon, Phone as PhoneIcon, Lock as LockIcon,
  LocationOn as LocationIcon, CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const UpdateLeaderForm = ({ leader, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: leader?.name || '',
    email: leader?.email || '',
    phone: leader?.phone || '',
    address: leader?.address || '',
    role: leader?.role || 'leader',
    status: leader?.status || 'active',
    password: '',
    confirmPassword: ''
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(leader?.avatar || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (leader) {
      setFormData({
        name: leader.name || '',
        email: leader.email || '',
        phone: leader.phone || '',
        address: leader.address || '',
        avatar: leader.avatar || '',
        role: leader.role || 'leader',
        status: leader.status || 'active',
        password: '',
        confirmPassword: ''
      });
      setAvatarPreview(leader.avatar || null);
    }
  }, [leader]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên là bắt buộc';
    else if (formData.name.length < 2) newErrors.name = 'Tên phải có ít nhất 2 ký tự';
    
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ';
    
    if (formData.password) {
      if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = { ...formData };
      
      // Add avatar data to update
      if (avatarPreview) {
        updateData.avatar = avatarPreview;
      }
      
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }

      if (onUpdate) {
        await onUpdate(leader.id, updateData);
      }

      setSnackbar({ open: true, message: 'Cập nhật quản lý nội bộ thành công!', severity: 'success' });
      
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi cập nhật', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const commonFieldStyle = {
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.2s ease',
      '&:hover': { backgroundColor: '#fafafa' },
      '&.Mui-focused': { backgroundColor: '#ffffff' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a237e',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1a237e',
      fontWeight: 600,
    },
  };

  const formFields = [
    { 
      label: 'Họ và tên', 
      field: 'name', 
      type: 'text',
      icon: <PersonIcon sx={{ color: '#1a237e' }} />,
      placeholder: 'Nhập họ và tên đầy đủ'
    },
    { 
      label: 'Email', 
      field: 'email', 
      type: 'email',
      icon: <EmailIcon sx={{ color: '#1a237e' }} />,
      placeholder: 'example@email.com'
    },
    { 
      label: 'Số điện thoại', 
      field: 'phone', 
      type: 'text',
      icon: <PhoneIcon sx={{ color: '#1a237e' }} />,
      placeholder: '0123456789'
    },
  
  ];

  const buttonStyle = {
    px: 3,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 600,
    transition: 'all 0.2s ease',
    '&:hover': { 
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(26, 35, 126, 0.15)'
    }
  };

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: 'white', 
              mr: 2,
              transition: 'all 0.2s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Cập nhật Quản lý nội bộ
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Chỉnh sửa thông tin quản lý nội bộ: {leader?.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form */}
      <Card sx={{ 
        background: 'white', 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: '0 12px 40px rgba(26, 35, 126, 0.15)' }
      }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Avatar */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', mb: 1 }}>
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid #e3f2fd', 
                      bgcolor: avatarPreview ? 'transparent' : '#1a237e',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 25px rgba(26, 35, 126, 0.2)'
                      }
                    }}
                    src={avatarPreview}
                  >
                    {!avatarPreview && formData.name.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <IconButton
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      bgcolor: '#1a237e', 
                      color: 'white', 
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: '#3949ab',
                        transform: 'scale(1.1)'
                      }
                    }}
                    component="label"
                  >
                    <PhotoCameraIcon />
                    <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Nhấn để thay đổi ảnh đại diện
                </Typography>
              </Box>

              {/* Form Fields */}
              {formFields.map(({ label, field, type, icon, placeholder, multiline, rows }) => (
                <TextField
                  key={field}
                  fullWidth
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  multiline={multiline}
                  rows={rows}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
                  }}
                  sx={commonFieldStyle}
                />
              ))}

              {/* Role and Status */}
              <FormControl fullWidth sx={commonFieldStyle}>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ mr: 1, color: '#1a237e' }} />
                      Quản trị viên
                    </Box>
                  </MenuItem>
                  <MenuItem value="leader">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: '#1a237e' }} />
                      Trưởng nhóm
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={commonFieldStyle}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  label="Trạng thái"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="active">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} />
                      Đang hoạt động
                    </Box>
                  </MenuItem>
                  <MenuItem value="inactive">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                      Không hoạt động
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Password Section */}
              <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
                  Cập nhật mật khẩu (tùy chọn)
                </Typography>
                <TextField
                  fullWidth
                  label="Mật khẩu mới"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  placeholder="Để trống nếu không thay đổi"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#1a237e' }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => setShowPassword(!showPassword)} 
                          edge="end"
                          sx={{ color: '#666' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={commonFieldStyle}
                />
                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  placeholder="Nhập lại mật khẩu mới"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#1a237e' }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                          edge="end"
                          sx={{ color: '#666' }}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...commonFieldStyle, mt: 2 }}
                />
              </Box>

              {/* Action Buttons */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  sx={{ 
                    borderColor: '#1a237e', 
                    color: '#1a237e', 
                    '&:hover': { 
                      borderColor: '#3949ab', 
                      bgcolor: 'rgba(26, 35, 126, 0.04)'
                    },
                    ...buttonStyle
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#1a237e', 
                    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
                    '&:hover': { 
                      bgcolor: '#3949ab',
                      boxShadow: '0 6px 16px rgba(26, 35, 126, 0.3)'
                    },
                    '&:disabled': { 
                      bgcolor: '#ccc',
                      transform: 'none',
                      boxShadow: 'none'
                    },
                    ...buttonStyle
                  }}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật quản lý nội bộ'}
                </Button>
              </Box>
            </Box>
          </form>
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '& .MuiAlert-icon': { fontSize: 24 }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateLeaderForm; 