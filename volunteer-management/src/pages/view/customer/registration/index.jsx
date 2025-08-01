import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Container,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Fade,
  Zoom,
  Slide,
  Grow,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Phone,
  Email,
  CalendarToday,
  LocationOn,
  School,
  Work,
  Psychology,
  CheckCircle,
  Warning,
  Celebration,
  VolunteerActivism,
  Star,
  Favorite,
  EmojiEvents
} from '@mui/icons-material';
import AppBar from '../../../../components/appBar/index.jsx';
import Footer from '../../../../components/footer/index.jsx';
import { createActivityRegistrationAPI, fetchUserInfoAPI } from '../../../../apis';
import { toast } from 'react-toastify';

const ActivityRegistration = () => {
  const navigate = useNavigate();
  const { activityId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Thêm CSS animations cho hiệu ứng đẹp
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes successPulse {
        0% { transform: scale(1); box-shadow: 0 12px 40px rgba(76, 175, 80, 0.4), 0 0 0 8px rgba(255, 215, 0, 0.2); }
        50% { transform: scale(1.1); box-shadow: 0 16px 50px rgba(76, 175, 80, 0.6), 0 0 0 12px rgba(255, 215, 0, 0.3); }
        100% { transform: scale(1); box-shadow: 0 12px 40px rgba(76, 175, 80, 0.4), 0 0 0 8px rgba(255, 215, 0, 0.2); }
      }
      
      @keyframes ripple {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes gradientShift {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      
      @keyframes statusPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .success-dialog-content {
        animation: slideInUp 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Form data
  const [formData, setFormData] = useState({
    activity_id: activityId,
    full_name: '',
    phone: '',
    email: '',
    birth_date: '',
    gender: '',
    address: '',
    education_level: '',
    school: '',
    major: '',
    occupation: 'n',
    company: '',
    experience: '',
    skills: '',
    participation_ability: ''
  });

  const steps = [
    'Thông tin cá nhân',
    'Học tập & Công việc',
    'Kinh nghiệm & Kỹ năng',
    'Xác nhận đăng ký'
  ];

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    
    if (token && userId) {
      setIsAuthenticated(true);
      fetchUserInfo(userId);
    } else {
      setIsAuthenticated(false);
      toast.error('Vui lòng đăng nhập để đăng ký tham gia hoạt động');
      navigate('/dang-nhap');
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      setLoading(true);
      const response = await fetchUserInfoAPI(userId);
      const user = response;
      console.log("user",user)
      setUserInfo(user);
      setFormData(prev => ({
        ...prev,
        full_name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: '' // Dữ liệu ảo
      }));
    } catch (error) {
      console.error('Error fetching user info:', error);
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };



  // Validation rules - tối ưu hóa để giảm lag
  const validateStep = React.useCallback((step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Personal Info
        if (!formData.full_name?.trim()) {
          newErrors.full_name = 'Họ tên là bắt buộc';
        } else if (formData.full_name.length < 2) {
          newErrors.full_name = 'Họ tên phải có ít nhất 2 ký tự';
        }
        
        if (!formData.phone?.trim()) {
          newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        }
        
        if (!formData.email?.trim()) {
          newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email không hợp lệ';
        }
        
        if (!formData.birth_date) {
          newErrors.birth_date = 'Ngày sinh là bắt buộc';
        } else {
          const birthDate = new Date(formData.birth_date);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 16 || age > 70) {
            newErrors.birth_date = 'Tuổi phải từ 16-70 tuổi';
          }
        }
        
        if (!formData.gender) {
          newErrors.gender = 'Giới tính là bắt buộc';
        }
        
        if (!formData.address?.trim()) {
          newErrors.address = 'Địa chỉ là bắt buộc';
        }
        break;
        
      case 1: // Education & Work
        if (!formData.education_level) {
          newErrors.education_level = 'Trình độ học vấn là bắt buộc';
        }
        
        if (!formData.school?.trim()) {
          newErrors.school = 'Trường học là bắt buộc';
        }
        
        if (!formData.occupation?.trim()) {
          newErrors.occupation = 'Nghề nghiệp là bắt buộc';
        }
        break;
        
      case 2: // Experience & Skills
        if (!formData.experience?.trim()) {
          newErrors.experience = 'Kinh nghiệm là bắt buộc';
        } else if (formData.experience.length < 20) {
          newErrors.experience = 'Kinh nghiệm phải có ít nhất 20 ký tự';
        }
        
        if (!formData.skills?.trim()) {
          newErrors.skills = 'Kỹ năng là bắt buộc';
        } else if (formData.skills.length < 10) {
          newErrors.skills = 'Kỹ năng phải có ít nhất 10 ký tự';
        }
        
        if (!formData.participation_ability) {
          newErrors.participation_ability = 'Khả năng tham gia là bắt buộc';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    } else {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate tất cả các bước trước khi submit
    const isStep0Valid = validateStep(0);
    const isStep1Valid = validateStep(1);
    const isStep2Valid = validateStep(2);
    
    if (!isStep0Valid || !isStep1Valid || !isStep2Valid) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc ở tất cả các bước');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await createActivityRegistrationAPI(formData);
      
      setShowSuccessDialog(true);
      // Tự động chuyển hướng sau 5 giây để user có thời gian đọc thông báo
      setTimeout(() => {
        setShowSuccessDialog(false);
        navigate('/hoat-dong');
      }, 5000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(error.response?.data?.message || 'Không thể đăng ký tham gia hoạt động');
    } finally {
      setSubmitting(false);
    }
  };

  // Tối ưu hóa handleInputChange để tránh lag
  const handleInputChange = React.useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Debounced input change cho các trường text dài - tối ưu hóa
  const debouncedInputChange = React.useCallback((field, value) => {
    // Cập nhật ngay lập tức cho UI
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error ngay lập tức
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const renderPersonalInfo = () => (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mb: 3, display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1, color: '#ffd700' }} />
          Thông tin cá nhân
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Họ tên *"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
              error={!!errors.full_name}
              helperText={errors.full_name}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.full_name ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.full_name ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: errors.full_name ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại *"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              error={!!errors.phone}
              helperText={errors.phone}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.phone ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.phone ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <Phone sx={{ mr: 1, color: errors.phone ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.email ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.email ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: errors.email ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Ngày sinh *"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleInputChange('birth_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.birth_date}
              helperText={errors.birth_date}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.birth_date ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.birth_date ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <CalendarToday sx={{ mr: 1, color: errors.birth_date ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Giới tính *</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                label="Giới tính *"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: errors.gender ? '#d32f2f' : '#1a237e' },
                    '&.Mui-focused fieldset': { borderColor: errors.gender ? '#d32f2f' : '#1a237e' }
                  }
                }}
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
                <MenuItem value="Khác">Khác</MenuItem>
              </Select>
              {errors.gender && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.gender}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Địa chỉ *"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => debouncedInputChange('address', e.target.value)}
              required
              error={!!errors.address}
              helperText={errors.address}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.address ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.address ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <LocationOn sx={{ mr: 1, color: errors.address ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );

  const renderEducationWork = () => (
    <Slide direction="left" in timeout={500}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mb: 3, display: 'flex', alignItems: 'center' }}>
          <School sx={{ mr: 1, color: '#ffd700' }} />
          Học tập & Công việc
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.education_level}>
              <InputLabel>Trình độ *</InputLabel>
              <Select
                value={formData.education_level}
                onChange={(e) => handleInputChange('education_level', e.target.value)}
                label="Trình độ *"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: errors.education_level ? '#d32f2f' : '#1a237e' },
                    '&.Mui-focused fieldset': { borderColor: errors.education_level ? '#d32f2f' : '#1a237e' }
                  }
                }}
              >
                <MenuItem value="Trung học phổ thông">Trung học phổ thông</MenuItem>
                <MenuItem value="Cao đẳng">Cao đẳng</MenuItem>
                <MenuItem value="Đại học">Đại học</MenuItem>
                <MenuItem value="Sau đại học">Sau đại học</MenuItem>
              </Select>
              {errors.education_level && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.education_level}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Trường *"
              value={formData.school}
              onChange={(e) => handleInputChange('school', e.target.value)}
              required
              error={!!errors.school}
              helperText={errors.school}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.school ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.school ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <School sx={{ mr: 1, color: errors.school ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Chuyên ngành"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nghề nghiệp *"
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              required
              error={!!errors.occupation}
              helperText={errors.occupation}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.occupation ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.occupation ? '#d32f2f' : '#1a237e' }
                }
              }}
              InputProps={{
                startAdornment: <Work sx={{ mr: 1, color: errors.occupation ? '#d32f2f' : '#1a237e' }} />
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Công ty"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: '#1a237e' }
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Slide>
  );

  const renderExperienceSkills = () => (
    <Zoom in timeout={500}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', mb: 3, display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 1, color: '#ffd700' }} />
          Kinh nghiệm & Kỹ năng
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kinh nghiệm *"
              multiline
              rows={4}
              value={formData.experience}
              onChange={(e) => debouncedInputChange('experience', e.target.value)}
              required
              error={!!errors.experience}
              helperText={errors.experience || "Mô tả kinh nghiệm tình nguyện và các hoạt động xã hội (tối thiểu 20 ký tự)"}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.experience ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.experience ? '#d32f2f' : '#1a237e' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kỹ năng *"
              multiline
              rows={3}
              value={formData.skills}
              onChange={(e) => debouncedInputChange('skills', e.target.value)}
              required
              error={!!errors.skills}
              helperText={errors.skills || "Các kỹ năng có thể hỗ trợ hoạt động tình nguyện (tối thiểu 10 ký tự)"}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: errors.skills ? '#d32f2f' : '#1a237e' },
                  '&.Mui-focused fieldset': { borderColor: errors.skills ? '#d32f2f' : '#1a237e' }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.participation_ability}>
              <InputLabel>Khả năng tham gia *</InputLabel>
              <Select
                value={formData.participation_ability}
                onChange={(e) => handleInputChange('participation_ability', e.target.value)}
                label="Khả năng tham gia *"
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: errors.participation_ability ? '#d32f2f' : '#1a237e' },
                    '&.Mui-focused fieldset': { borderColor: errors.participation_ability ? '#d32f2f' : '#1a237e' }
                  }
                }}
              >
                <MenuItem value="Có thể tham gia toàn bộ chương trình">Có thể tham gia toàn bộ chương trình</MenuItem>
                <MenuItem value="Chỉ có thể tham gia một phần">Chỉ có thể tham gia một phần</MenuItem>
                <MenuItem value="Cần thảo luận thêm">Cần thảo luận thêm</MenuItem>
              </Select>
              {errors.participation_ability && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.participation_ability}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Zoom>
  );

  const renderConfirmation = () => (
    <Box>
      <Typography variant="h6" gutterBottom color="#1a237e">
        Xác nhận thông tin đăng ký
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Thông tin cá nhân
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Họ tên:</strong> {formData.full_name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>SĐT:</strong> {formData.phone}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Email:</strong> {formData.email}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Ngày sinh:</strong> {formData.birth_date}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Giới tính:</strong> {formData.gender}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2"><strong>Địa chỉ:</strong> {formData.address}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Học tập & Công việc
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Trình độ:</strong> {formData.education_level}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Trường:</strong> {formData.school}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Chuyên ngành:</strong> {formData.major}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2"><strong>Nghề nghiệp:</strong> {formData.occupation}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2"><strong>Công ty:</strong> {formData.company}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Kinh nghiệm & Kỹ năng
          </Typography>
          <Typography variant="body2" paragraph><strong>Kinh nghiệm:</strong> {formData.experience}</Typography>
          <Typography variant="body2" paragraph><strong>Kỹ năng:</strong> {formData.skills}</Typography>
          <Typography variant="body2"><strong>Khả năng tham gia:</strong> {formData.participation_ability}</Typography>
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Vui lòng kiểm tra kỹ thông tin trước khi xác nhận đăng ký. 
          Thông tin này sẽ được sử dụng để đánh giá khả năng tham gia hoạt động.
        </Typography>
      </Alert>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderEducationWork();
      case 2:
        return renderExperienceSkills();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading && !userInfo) {
    return (
      <>
        <AppBar />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ color: '#1a237e' }} />
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppBar />
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ bgcolor: '#fff', borderBottom: 1, borderColor: '#e9ecef' }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
              <IconButton onClick={() => navigate('/hoat-dong')} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a237e' }}>
                Đăng ký tham gia hoạt động
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Stepper */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Form Content */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              {renderStepContent(activeStep)}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{
                color: '#1a237e',
                borderColor: '#1a237e',
                '&:hover': { borderColor: '#283593' }
              }}
            >
              Quay lại
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#283593' }
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Xác nhận đăng ký'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    bgcolor: '#1a237e',
                    '&:hover': { bgcolor: '#283593' }
                  }}
                >
                  Tiếp tục
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Success Dialog - Thiết kế chuyên nghiệp với màu #1a237e */}
      <Dialog
        open={showSuccessDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
            color: 'white',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(26, 35, 126, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <DialogContent sx={{ p: 0, textAlign: 'center' }}>
          {/* Animated Background */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 40% 80%, rgba(76, 175, 80, 0.1) 0%, transparent 40%)
            `,
            animation: 'gradientShift 8s ease-in-out infinite',
            pointerEvents: 'none'
          }} />
          
          {/* Floating Particles */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            {[...Array(6)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'rgba(255, 215, 0, 0.6)',
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </Box>
          
          {/* Main Content */}
          <Box sx={{ p: 6, position: 'relative', zIndex: 1 }} className="success-dialog-content">
            {/* Success Icon with Animation */}
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #4CAF50, #45a049, #66BB6A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4), 0 0 0 8px rgba(255, 215, 0, 0.2)',
              animation: 'successPulse 2s ease-in-out infinite',
              position: 'relative'
            }}>
              <CheckCircle sx={{ fontSize: 60, color: 'white' }} />
              {/* Ripple Effect */}
              <Box sx={{
                position: 'absolute',
                top: -8,
                left: -8,
                right: -8,
                bottom: -8,
                borderRadius: '50%',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                animation: 'ripple 2s ease-out infinite'
              }} />
            </Box>

            {/* Main Title */}
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              mb: 3, 
              color: 'white',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px'
            }}>
              Đăng Ký Thành Công! 🎉
            </Typography>

            {/* Subtitle */}
            <Typography variant="h5" sx={{ 
              mb: 4, 
              color: 'rgba(255,255,255,0.95)',
              lineHeight: 1.4,
              fontWeight: 500
            }}>
              Chào mừng bạn gia nhập cộng đồng tình nguyện viên!
            </Typography>

            {/* Thank You Message */}
            <Box sx={{ 
              background: 'rgba(255,255,255,0.08)', 
              borderRadius: 3, 
              p: 4, 
              mb: 4,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Decorative Corner */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '0 40px 40px 0',
                borderColor: 'transparent rgba(255, 215, 0, 0.3) transparent transparent'
              }} />
              
              <Typography variant="h6" sx={{ 
                mb: 3, 
                color: '#FFD700',
                fontWeight: 700,
                textAlign: 'center'
              }}>
                🌟 Lời Cảm Ơn Chân Thành 🌟
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.8,
                mb: 3,
                fontSize: '16px',
                textAlign: 'justify'
              }}>
                "Cảm ơn bạn đã tin tưởng và chọn tham gia cùng chúng tôi trong hành trình lan tỏa yêu thương! 
                Mỗi bước đi của bạn hôm nay sẽ tạo nên những thay đổi tích cực cho cộng đồng. 
                Sự nhiệt huyết và tấm lòng của bạn chính là động lực để chúng tôi tiếp tục sứ mệnh này."
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.8,
                mb: 3,
                fontSize: '16px',
                textAlign: 'justify'
              }}>
                "Tình nguyện không chỉ là cho đi, mà còn là nhận lại những giá trị vô giá về tình yêu thương, 
                sự chia sẻ và những kỷ niệm đẹp. Chúng tôi tin rằng cùng nhau, chúng ta sẽ tạo nên những 
                điều kỳ diệu cho cuộc sống."
              </Typography>
              
              <Box sx={{
                background: 'linear-gradient(90deg, rgba(255,215,0,0.1), rgba(76,175,80,0.1))',
                borderRadius: 2,
                p: 3,
                border: '1px solid rgba(255,215,0,0.2)'
              }}>
                <Typography variant="body1" sx={{ 
                  color: '#FFD700',
                  lineHeight: 1.7,
                  fontWeight: 600,
                  textAlign: 'center'
                }}>
                  📧 <strong>Bước Tiếp Theo:</strong> Chúng tôi sẽ xem xét thông tin của bạn trong vòng 24-48 giờ 
                  và gửi thông báo qua email. Hãy kiểm tra hộp thư và spam folder nhé!
                </Typography>
              </Box>
            </Box>

            {/* Progress Status */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              mb: 5,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 3,
              p: 3,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                  animation: 'statusPulse 2s ease-in-out infinite'
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    ✓
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  Đã Gửi
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #FFC107, #FFB300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 16px rgba(255, 193, 7, 0.3)',
                  animation: 'statusPulse 2s ease-in-out infinite 0.5s'
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    ⏳
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  Đang Xử Lý
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #2196F3, #42A5F5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
                  animation: 'statusPulse 2s ease-in-out infinite 1s'
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                    📧
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                  Sẽ Thông Báo
                </Typography>
              </Box>
            </Box>

            {/* Simple Close Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/hoat-dong');
                }}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderWidth: 1,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Đóng
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default ActivityRegistration; 