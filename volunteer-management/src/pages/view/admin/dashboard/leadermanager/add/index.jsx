import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar,
  Grid, IconButton, Alert, Snackbar, CircularProgress, Divider,
  InputAdornment, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Save as SaveIcon, 
  PhotoCamera as PhotoCameraIcon, Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon, Person as PersonIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const AddLeaderForm = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', role: 'leader'
  });
  
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    if (!formData.email.trim()) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!formData.password.trim()) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newLeaderData = {
        ...formData,
        avatar: avatarPreview // Send avatar data to backend
      };
      
      await onSave(newLeaderData);
      setSnackbar({ open: true, message: 'Thêm quản lý nội bộ thành công!', severity: 'success' });
      setFormData({ name: '', email: '', phone: '', password: '', role: 'leader' });
      setAvatar(null);
      setAvatarPreview(null);
    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi thêm quản lý nội bộ', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const commonFieldStyle = {
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#fafafa',
      },
      '&.Mui-focused': {
        backgroundColor: '#ffffff',
      },
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
      placeholder: 'Nhập họ và tên đầy đủ'
    },
    { 
      label: 'Email', 
      field: 'email', 
      type: 'email',
      placeholder: 'example@email.com'
    },
    { 
      label: 'Số điện thoại', 
      field: 'phone', 
      type: 'text',
      placeholder: '0123456789'
    },
    { 
      label: 'Mật khẩu', 
      field: 'password', 
      type: showPassword ? 'text' : 'password',
      placeholder: 'Tối thiểu 6 ký tự',
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
      )
    }
  ];

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={onBack} 
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
          <Typography variant="h5" fontWeight={600}>
            Thêm Quản lý nội bộ mới
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Điền thông tin để thêm quản lý nội bộ mới vào hệ thống
        </Typography>
      </Box>

      {/* Form */}
      <Card sx={{ 
        background: 'white', 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(26, 35, 126, 0.15)',
        }
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

              {/* Các trường nhập liệu */}
              {formFields.map(({ label, field, type, placeholder, endAdornment }) => (
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
                  InputProps={{ endAdornment }}
                  sx={commonFieldStyle}
                />
              ))}

              {/* Vai trò */}
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

              {/* Nút hành động */}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onBack}
                  sx={{ 
                    borderColor: '#1a237e', 
                    color: '#1a237e', 
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      borderColor: '#3949ab', 
                      bgcolor: 'rgba(26, 35, 126, 0.04)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(26, 35, 126, 0.15)'
                    }
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
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      bgcolor: '#3949ab',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(26, 35, 126, 0.3)'
                    },
                    '&:disabled': { 
                      bgcolor: '#ccc',
                      transform: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {loading ? 'Đang lưu...' : 'Lưu quản lý nội bộ'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddLeaderForm; 