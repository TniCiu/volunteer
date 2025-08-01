import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Grid, Alert, Snackbar, CircularProgress, Divider, Avatar, IconButton,
  FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Checkbox
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Save as SaveIcon, 
  Event as EventIcon, Description as DescriptionIcon,
  LocationOn as LocationIcon, Schedule as ScheduleIcon,
  People as PeopleIcon, Campaign as CampaignIcon,
  Add as AddIcon, Delete as DeleteIcon, Image as ImageIcon,
  Person as PersonIcon, Label as LabelIcon
} from '@mui/icons-material';
import { getAllLeadersAndAdminsAPI, getAllTagsAPI } from '../../../../../../apis';

const AddActivity = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    slogan: '',
    date: '',
    time: '',
    participants_max: '',
    location: '',
    address: '',
    description: '',
    image: '',
    timeline: [],
    leader_id: '',
    tag_ids: []
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [leaders, setLeaders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch leaders and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [leadersData, tagsData] = await Promise.all([
          getAllLeadersAndAdminsAPI(),
          getAllTagsAPI()
        ]);
        
        // Filter out admins, only keep leaders
        const leadersOnly = leadersData.filter(user => user.role === 'leader');
        setLeaders(leadersOnly);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({ 
          open: true, 
          message: 'Có lỗi khi tải dữ liệu leaders và tags', 
          severity: 'error' 
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTimelineChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { day: '', time: '', activity: '' }]
    }));
  };

  const removeTimelineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Tên hoạt động là bắt buộc';
    else if (formData.title.length < 5) newErrors.title = 'Tên hoạt động phải có ít nhất 5 ký tự';
    else if (formData.title.length > 255) newErrors.title = 'Tên hoạt động không được vượt quá 255 ký tự';
    
    if (!formData.slogan.trim()) newErrors.slogan = 'Slogan là bắt buộc';
    else if (formData.slogan.length < 5) newErrors.slogan = 'Slogan phải có ít nhất 5 ký tự';
    else if (formData.slogan.length > 255) newErrors.slogan = 'Slogan không được vượt quá 255 ký tự';
    
    // Validate date logic
    if (!formData.date.trim()) {
      newErrors.date = 'Ngày là bắt buộc';
    } else {
      // Validate date format "DD/MM/YYYY - DD/MM/YYYY"
      const dateRegex = /^\d{2}\/\d{2}\/\d{4} - \d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = 'Định dạng ngày phải là DD/MM/YYYY - DD/MM/YYYY';
      } else {
        // Validate that end date is after start date
        const dateParts = formData.date.split(' - ');
        const startDateStr = dateParts[0];
        const endDateStr = dateParts[1];
        
        const startParts = startDateStr.split('/');
        const endParts = endDateStr.split('/');
        
        const startDate = new Date(startParts[2], startParts[1] - 1, startParts[0]);
        const endDate = new Date(endParts[2], endParts[1] - 1, endParts[0]);
        
        if (endDate <= startDate) {
          newErrors.date = 'Ngày kết thúc phải sau ngày bắt đầu';
        }
        
        // Check if end date is not in the past
        if (endDate < new Date()) {
          newErrors.date = 'Ngày kết thúc không được trong quá khứ';
        }
      }
    }
    
    if (!formData.time.trim()) newErrors.time = 'Thời gian là bắt buộc';
    
    if (!formData.participants_max) newErrors.participants_max = 'Số lượng tối đa là bắt buộc';
    else if (isNaN(formData.participants_max) || parseInt(formData.participants_max) <= 0) {
      newErrors.participants_max = 'Số lượng tối đa phải là số dương';
    }
    
    if (!formData.location.trim()) newErrors.location = 'Địa điểm là bắt buộc';
    
    if (!formData.address.trim()) newErrors.address = 'Địa chỉ chi tiết là bắt buộc';
    
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Mô tả không được vượt quá 2000 ký tự';
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'URL hình ảnh không hợp lệ';
    }
    
    // Validate timeline
    if (formData.timeline.length > 0) {
      formData.timeline.forEach((item, index) => {
        if (!item.day.trim()) {
          newErrors[`timeline_${index}_day`] = 'Ngày là bắt buộc';
        }
        if (!item.time.trim()) {
          newErrors[`timeline_${index}_time`] = 'Thời gian là bắt buộc';
        }
        if (!item.activity.trim()) {
          newErrors[`timeline_${index}_activity`] = 'Hoạt động là bắt buộc';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      
      
      const newActivity = {
        title: formData.title.trim(),
        slogan: formData.slogan.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        participants_current: 0,
        participants_max: parseInt(formData.participants_max),
        participants_percentage: 0,
        location: formData.location.trim(),
        address: formData.address.trim(),
        description: formData.description.trim() || null,
        image: formData.image.trim() || null,
        timeline: formData.timeline.filter(item => item.day.trim() && item.time.trim() && item.activity.trim()),
        leader_id: formData.leader_id ? parseInt(formData.leader_id) : null,
        tag_ids: formData.tag_ids.map(id => parseInt(id))
      };
      
      await onSave(newActivity);
      setSnackbar({ open: true, message: 'Thêm hoạt động thành công!', severity: 'success' });
      setFormData({
        title: '', slogan: '', date: '', time: '', participants_max: '',
        location: '', address: '', description: '', image: '', leader_id: '', tag_ids: []
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi thêm hoạt động', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
            Thêm Hoạt động mới
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Điền thông tin để thêm hoạt động mới vào hệ thống
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
              {/* Activity Icon */}
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
                    <EventIcon sx={{ fontSize: 60, color: 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Hoạt động tình nguyện
                </Typography>
              </Box>

              {/* Form Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Title */}
                <TextField
                  fullWidth
                  label="Tên hoạt động"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                  placeholder="Nhập tên hoạt động"
                  InputProps={{
                    startAdornment: (
                      <EventIcon sx={{ mr: 1, color: '#1a237e' }} />
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

                {/* Slogan */}
                <TextField
                  fullWidth
                  label="Slogan"
                  value={formData.slogan}
                  onChange={(e) => handleInputChange('slogan', e.target.value)}
                  error={!!errors.slogan}
                  helperText={errors.slogan}
                  required
                  placeholder="Nhập slogan cho hoạt động"
                  InputProps={{
                    startAdornment: (
                      <CampaignIcon sx={{ mr: 1, color: '#1a237e' }} />
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

                {/* Tags Selection */}
                <Box sx={{ 
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LabelIcon sx={{ mr: 1, color: '#1a237e' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      Tags
                    </Typography>
                  </Box>
                  <FormControl fullWidth>
                    <InputLabel id="tag-select-label">Tags</InputLabel>
                    <Select
                      labelId="tag-select-label"
                      value={formData.tag_ids}
                      onChange={(e) => setFormData(prev => ({ ...prev, tag_ids: e.target.value }))}
                      label="Tags"
                      multiple
                      disabled={loadingData}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={tags.find(tag => tag.id === value)?.name || ''}
                              size="small"
                              sx={{
                                backgroundColor: '#1a237e',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#3949ab'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      input={
                        <OutlinedInput
                          label="Tags"
                          id="select-multiple-chip"
                        />
                      }
                    >
                      {tags.map((tag) => (
                        <MenuItem
                          key={tag.id}
                          value={tag.id}
                        >
                          {tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Date */}
                <TextField
                  fullWidth
                  label="Ngày"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  error={!!errors.date}
                  helperText={errors.date || 'VD: 15/01/2024 - 20/01/2024'}
                  required
                  placeholder="15/01/2024 - 20/01/2024"
                  InputProps={{
                    startAdornment: (
                      <EventIcon sx={{ mr: 1, color: '#1a237e' }} />
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

                {/* Time */}
                <TextField
                  fullWidth
                  label="Thời gian"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  error={!!errors.time}
                  helperText={errors.time || 'VD: 08:00 - 17:00 hàng ngày'}
                  required
                  placeholder="08:00 - 17:00 hàng ngày"
                  InputProps={{
                    startAdornment: (
                      <ScheduleIcon sx={{ mr: 1, color: '#1a237e' }} />
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

                {/* Location and Address */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Địa điểm"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      error={!!errors.location}
                      helperText={errors.location}
                      required
                      placeholder="Xã Đắk Nông, Huyện Đắk Glong, Tỉnh Đắk Nông"
                      InputProps={{
                        startAdornment: (
                          <LocationIcon sx={{ mr: 1, color: '#1a237e' }} />
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Địa chỉ chi tiết"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      error={!!errors.address}
                      helperText={errors.address}
                      required
                      placeholder="Thôn 5, Xã Đắk Nông, Huyện Đắk Glong, Tỉnh Đắk Nông"
                      InputProps={{
                        startAdornment: (
                          <LocationIcon sx={{ mr: 1, color: '#1a237e' }} />
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
                  </Grid>
                </Grid>

                {/* Participants Max */}
                <TextField
                  fullWidth
                  label="Số lượng tối đa"
                  value={formData.participants_max}
                  onChange={(e) => handleInputChange('participants_max', e.target.value)}
                  error={!!errors.participants_max}
                  helperText={errors.participants_max}
                  required
                  placeholder="20"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <PeopleIcon sx={{ mr: 1, color: '#1a237e' }} />
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

                {/* Image URL */}
                <Box sx={{ 
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ImageIcon sx={{ mr: 1, color: '#1a237e' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      Hình ảnh Hoạt động
                    </Typography>
                  </Box>
                  
                  <TextField
                    fullWidth
                    label="URL hình ảnh (tùy chọn)"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    error={!!errors.image}
                    helperText={errors.image || 'Link hình ảnh cho hoạt động'}
                    placeholder="https://example.com/image.jpg"
                    InputProps={{
                      startAdornment: (
                        <ImageIcon sx={{ mr: 1, color: '#1a237e' }} />
                      ),
                    }}
                    sx={{
                      mb: 2,
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
                  
                  {formData.image && (
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      backgroundColor: 'white', 
                      borderRadius: 2,
                      border: '1px solid #e0e0e0'
                    }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Preview:
                      </Typography>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          maxWidth: '300px', 
                          height: 'auto', 
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Description */}
                <TextField
                  fullWidth
                  label="Mô tả (tùy chọn)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description || 'Mô tả chi tiết về hoạt động này'}
                  multiline
                  rows={6}
                  placeholder="Nhập mô tả chi tiết về hoạt động..."
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
                    Số ký tự mô tả: {formData.description.length}/2000
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số ký tự tên: {formData.title.length}/255
                  </Typography>
                </Box>

                {/* Timeline */}
                <Box sx={{ 
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon sx={{ mr: 1, color: '#1a237e' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                      Timeline Hoạt động
                    </Typography>
                  </Box>
                  
                  {formData.timeline.map((item, index) => (
                    <Box key={index} sx={{ 
                      mb: 2, 
                      p: 2, 
                      backgroundColor: 'white', 
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      position: 'relative'
                    }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          label="Ngày"
                          value={item.day}
                          onChange={(e) => handleTimelineChange(index, 'day', e.target.value)}
                          error={!!errors[`timeline_${index}_day`]}
                          helperText={errors[`timeline_${index}_day`]}
                          placeholder="VD: Ngay 1"
                          sx={{ flex: 1 }}
                          InputProps={{
                            startAdornment: (
                              <ScheduleIcon sx={{ mr: 1, color: '#1a237e', fontSize: 20 }} />
                            ),
                          }}
                        />
                        <TextField
                          label="Thời gian"
                          value={item.time}
                          onChange={(e) => handleTimelineChange(index, 'time', e.target.value)}
                          error={!!errors[`timeline_${index}_time`]}
                          helperText={errors[`timeline_${index}_time`]}
                          placeholder="VD: 08:00"
                          sx={{ flex: 1 }}
                          InputProps={{
                            startAdornment: (
                              <ScheduleIcon sx={{ mr: 1, color: '#1a237e', fontSize: 20 }} />
                            ),
                          }}
                        />
                        <IconButton
                          onClick={() => removeTimelineItem(index)}
                          sx={{ 
                            color: '#d32f2f',
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <TextField
                        fullWidth
                        label="Hoạt động"
                        value={item.activity}
                        onChange={(e) => handleTimelineChange(index, 'activity', e.target.value)}
                        error={!!errors[`timeline_${index}_activity`]}
                        helperText={errors[`timeline_${index}_activity`]}
                        placeholder="Mô tả hoạt động trong ngày này..."
                        multiline
                        rows={2}
                        InputProps={{
                          startAdornment: (
                            <EventIcon sx={{ mr: 1, color: '#1a237e', alignSelf: 'flex-start', mt: 1 }} />
                          ),
                        }}
                      />
                    </Box>
                  ))}
                  
                  <Button
                    variant="outlined"
                    onClick={addTimelineItem}
                    startIcon={<AddIcon />}
                    sx={{
                      borderColor: '#1a237e',
                      color: '#1a237e',
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#0d47a1',
                        backgroundColor: 'rgba(26, 35, 126, 0.04)',
                      },
                    }}
                  >
                    Thêm Timeline Item
                  </Button>
                </Box>

                                 {/* Leader Selection */}
                 <Box sx={{ 
                   p: 3,
                   backgroundColor: '#f8f9fa',
                   borderRadius: 2,
                   border: '1px solid #e0e0e0'
                 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                     <PersonIcon sx={{ mr: 1, color: '#1a237e' }} />
                     <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                       Trưởng hoạt động
                     </Typography>
                   </Box>
                   <FormControl fullWidth>
                     <InputLabel id="leader-select-label">Trưởng hoạt động</InputLabel>
                     <Select
                       labelId="leader-select-label"
                       value={formData.leader_id}
                       onChange={(e) => handleInputChange('leader_id', e.target.value)}
                       label="Trưởng hoạt động"
                       error={!!errors.leader_id}
                       disabled={loadingData}
                     >
                       <MenuItem value="">
                         <em>Chọn trưởng hoạt động</em>
                       </MenuItem>
                       {leaders.map((leader) => (
                         <MenuItem
                           key={leader.id}
                           value={leader.id}
                         >
                           {leader.name} ({leader.email})
                         </MenuItem>
                       ))}
                     </Select>
                   </FormControl>
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
                  onClick={onBack}
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
                  {loading ? 'Đang lưu...' : 'Lưu hoạt động'}
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

export default AddActivity; 