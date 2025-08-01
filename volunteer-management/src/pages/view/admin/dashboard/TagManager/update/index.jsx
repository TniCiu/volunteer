import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  IconButton, Alert, Snackbar, CircularProgress, Divider, Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Save as SaveIcon, 
  LocalOffer as TagIcon, Description as DescriptionIcon
} from '@mui/icons-material';

const UpdateTag = ({ tag, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: tag?.name || '',
    description: tag?.description || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || '',
        description: tag.description || ''
      });
    }
  }, [tag]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Tên loại hoạt động là bắt buộc';
    else if (formData.name.length < 2) newErrors.name = 'Tên loại hoạt động phải có ít nhất 2 ký tự';
    else if (formData.name.length > 255) newErrors.name = 'Tên loại hoạt động không được vượt quá 255 ký tự';
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Mô tả không được vượt quá 1000 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null
      };
      
      await onUpdate(tag.id, updateData);
      setSnackbar({ open: true, message: 'Cập nhật loại hoạt động thành công!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi cập nhật loại hoạt động', severity: 'error' });
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

  if (!tag) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={40} sx={{ color: '#1a237e' }} />
        <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
          Đang tải thông tin loại hoạt động...
        </Typography>
      </Box>
    );
  }

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
          <Typography variant="h5" fontWeight={600}>
            Chỉnh sửa Loại hoạt động
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Cập nhật thông tin loại hoạt động: <strong>{tag.name}</strong>
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
              {/* Tag Icon */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', mb: 1 }}>
                  <Avatar
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid #e3f2fd', 
                      bgcolor: '#1a237e',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 25px rgba(26, 35, 126, 0.2)'
                      }
                    }}
                  >
                    <TagIcon sx={{ fontSize: 60, color: 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Loại hoạt động tình nguyện
                </Typography>
              </Box>

              {/* Form Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Tag Name */}
                <TextField
                  fullWidth
                  label="Tên loại hoạt động"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  placeholder="Nhập tên loại hoạt động"
                  InputProps={{
                    startAdornment: (
                      <TagIcon sx={{ mr: 1, color: '#1a237e' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e',
                        }
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1a237e',
                        borderWidth: 2,
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1a237e',
                    }
                  }}
                />

                {/* Description */}
                <TextField
                  fullWidth
                  label="Mô tả (tùy chọn)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description || 'Mô tả chi tiết về loại hoạt động này'}
                  multiline
                  rows={4}
                  placeholder="Nhập mô tả chi tiết..."
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon sx={{ mr: 1, color: '#1a237e', alignSelf: 'flex-start', mt: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e',
                        }
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1a237e',
                        borderWidth: 2,
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1a237e',
                    }
                  }}
                />

                {/* Character Count */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 1
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Số ký tự mô tả: {formData.description.length}/1000
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số ký tự tên: {formData.name.length}/255
                  </Typography>
                </Box>

                {/* Tag Info */}
                <Box sx={{ 
                  p: 3,
                  backgroundColor: '#e3f2fd',
                  borderRadius: 2,
                  border: '1px solid #bbdefb'
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    color: '#1976d2', 
                    fontWeight: 600,
                    mb: 1
                  }}>
                    Thông tin hệ thống:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        ID: <strong>#{tag.id}</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ngày tạo: <strong>{new Date(tag.created_at).toLocaleDateString('vi-VN')}</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Cập nhật lần cuối: <strong>{new Date(tag.updated_at).toLocaleDateString('vi-VN')}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                pt: 2
              }}>
                <Button
                  variant="outlined"
                  onClick={onClose}
                  disabled={loading}
                  sx={{
                    borderColor: '#1a237e',
                    color: '#1a237e',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#0d47a1',
                      backgroundColor: 'rgba(26, 35, 126, 0.04)',
                    },
                  }}
                >
                  Hủy
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{
                    bgcolor: '#1a237e',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(26, 35, 126, 0.2)',
                    '&:hover': { 
                      bgcolor: '#3949ab',
                      boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)'
                    },
                    '&:disabled': {
                      bgcolor: '#e0e0e0',
                      color: '#9e9e9e',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật loại hoạt động'}
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
            '& .MuiAlert-icon': { fontSize: 24 }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateTag; 