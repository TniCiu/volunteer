import React, { useState } from 'react';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent,
  CardMedia, Chip, Avatar, LinearProgress, TextField, FormControl,
  Checkbox , Select, MenuItem, FormControlLabel, Radio, RadioGroup,
  FormLabel, Alert, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, InputAdornment, Divider, Stack, Paper, Badge
} from '@mui/material';
import {
  Favorite, FavoriteBorder, Share, Visibility, AttachMoney,
  People, CalendarToday, LocationOn, TrendingUp, Star,
  CheckCircle, Security, EmojiEvents, School,
  LocalHospital, Home, Restaurant, DirectionsWalk
} from '@mui/icons-material';
import AppBar from '../../index.jsx';

const DonationPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [likedProjects, setLikedProjects] = useState(new Set());

  // Mock data cho các dự án quyên góp
  const donationProjects = [
    {
      id: 1,
      title: 'Xây dựng thư viện cho trẻ em vùng cao',
      description: 'Dự án xây dựng thư viện với 1000+ sách cho trẻ em tại xã Đắk Nông, tỉnh Đắk Nông. Giúp các em có cơ hội tiếp cận tri thức và phát triển tương lai.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Giáo dục',
      target: 50000000,
      raised: 35000000,
      donors: 1247,
      daysLeft: 15,
      location: 'Xã Đắk Nông, Đắk Nông',
      organizer: {
        name: 'Tổ chức Giáo dục Vùng cao',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        verified: true
      },
      tags: ['#GiáoDục', '#TrẻEm', '#VùngCao', '#ThưViện'],
      updates: [
        { date: '2024-01-15', content: 'Đã hoàn thành 70% công trình xây dựng' },
        { date: '2024-01-10', content: 'Nhận được 500 cuốn sách từ nhà tài trợ' }
      ]
    },
    {
      id: 2,
      title: 'Khám sức khỏe miễn phí cho người dân nghèo',
      description: 'Tổ chức chương trình khám sức khỏe miễn phí cho 2000 người dân tại các vùng nông thôn. Bao gồm khám tổng quát, xét nghiệm cơ bản và tư vấn dinh dưỡng.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Y tế',
      target: 30000000,
      raised: 18000000,
      donors: 892,
      daysLeft: 8,
      location: 'Huyện Đắk Glong, Đắk Nông',
      organizer: {
        name: 'Hội Y tế Cộng đồng',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        verified: true
      },
      tags: ['#Y tế', '#KhámBệnh', '#MiễnPhí', '#CộngĐồng'],
      updates: [
        { date: '2024-01-12', content: 'Đã khám cho 500 người dân' },
        { date: '2024-01-08', content: 'Nhận được hỗ trợ từ 10 bác sĩ tình nguyện' }
      ]
    },
    {
      id: 3,
      title: 'Xây dựng nhà tình thương cho gia đình khó khăn',
      description: 'Xây dựng 5 căn nhà tình thương cho các gia đình có hoàn cảnh đặc biệt khó khăn tại vùng sâu vùng xa. Mỗi căn nhà có diện tích 60m2 với đầy đủ tiện nghi cơ bản.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Nhà ở',
      target: 80000000,
      raised: 45000000,
      donors: 2156,
      daysLeft: 22,
      location: 'Huyện Đắk Mil, Đắk Nông',
      organizer: {
        name: 'Tổ chức Nhân đạo Đắk Nông',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        verified: true
      },
      tags: ['#NhàỞ', '#TìnhThương', '#GiaĐình', '#XâyDựng'],
      updates: [
        { date: '2024-01-14', content: 'Hoàn thành 2 căn nhà đầu tiên' },
        { date: '2024-01-05', content: 'Khởi công xây dựng 3 căn nhà còn lại' }
      ]
    },
    {
      id: 4,
      title: 'Cung cấp bữa ăn cho trẻ em nghèo',
      description: 'Cung cấp bữa ăn dinh dưỡng hàng ngày cho 500 trẻ em có hoàn cảnh khó khăn tại các trường học vùng nông thôn. Dự án kéo dài 6 tháng với 3 bữa ăn/ngày.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Dinh dưỡng',
      target: 25000000,
      raised: 12000000,
      donors: 567,
      daysLeft: 12,
      location: 'Huyện Krông Nô, Đắk Nông',
      organizer: {
        name: 'Tổ chức Dinh dưỡng Trẻ em',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        verified: true
      },
      tags: ['#DinhDưỡng', '#TrẻEm', '#BữaĂn', '#TừThiện'],
      updates: [
        { date: '2024-01-13', content: 'Bắt đầu cung cấp bữa ăn cho 200 trẻ em' },
        { date: '2024-01-07', content: 'Ký hợp đồng với nhà cung cấp thực phẩm' }
      ]
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatPercentage = (raised, target) => {
    return Math.round((raised / target) * 100);
  };

  const handleLikeProject = (projectId) => {
    const newLikedProjects = new Set(likedProjects);
    if (newLikedProjects.has(projectId)) {
      newLikedProjects.delete(projectId);
    } else {
      newLikedProjects.add(projectId);
    }
    setLikedProjects(newLikedProjects);
  };

  const handleDonate = (project) => {
    setSelectedProject(project);
    setShowDonationDialog(true);
  };

  const handleDonationSubmit = () => {
    // Xử lý logic quyên góp ở đây
    console.log('Donation submitted:', {
      project: selectedProject,
      amount: donationAmount,
      type: donationType,
      donorName,
      donorEmail,
      donorMessage,
      isAnonymous
    });
    
    // Hiển thị thông báo thành công
    alert('Cảm ơn bạn đã quyên góp! Chúng tôi sẽ liên hệ sớm nhất.');
    setShowDonationDialog(false);
    // Reset form
    setDonationAmount('');
    setDonorName('');
    setDonorEmail('');
    setDonorMessage('');
    setIsAnonymous(false);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Giáo dục': return <School />;
      case 'Y tế': return <LocalHospital />;
      case 'Nhà ở': return <Home />;
      case 'Dinh dưỡng': return <Restaurant />;
      default: return <Favorite />;
    }
  };

  return (
    <>
      <AppBar />
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Hero Banner */}
        <Box sx={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
          <img 
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Donation Hero"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'brightness(0.6)'
            }}
          />
          <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(26,35,126,0.8) 0%, rgba(255,215,0,0.8) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Typography variant="h2" sx={{ 
                  fontWeight: 800, mb: 3,
                  fontSize: { xs: '32px', md: '48px' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                  Lan Tỏa Yêu Thương
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 300, mb: 4,
                  fontSize: { xs: '18px', md: '24px' },
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}>
                  Mỗi đồng quyên góp của bạn sẽ tạo nên sự khác biệt lớn lao
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<People />} 
                    label="1,247+ Nhà hảo tâm" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: '#1a237e', fontWeight: 600 }}
                  />
                  <Chip 
                    icon={<AttachMoney />} 
                    label="120M+ VNĐ đã quyên góp" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: '#1a237e', fontWeight: 600 }}
                  />
                  <Chip 
                    icon={<CheckCircle />} 
                    label="100% Minh bạch" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: '#1a237e', fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a237e' }}>
              Dự Án Quyên Góp
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" sx={{ borderColor: '#ffd700', color: '#1a237e' }}>
                Lọc theo danh mục
              </Button>
            </Box>
          </Box>

          {/* Projects Grid */}
          <Grid container spacing={4}>
            {donationProjects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ position: 'relative' }}
                  />
                  
                  {/* Category Badge */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16,
                    bgcolor: 'rgba(255,215,0,0.9)',
                    color: '#1a237e',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontWeight: 600
                  }}>
                    {getCategoryIcon(project.category)}
                    {project.category}
                  </Box>

                  {/* Verified Badge */}
                  {project.organizer.verified && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 16, 
                      right: 16,
                      bgcolor: '#4caf50',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '12px'
                    }}>
                      <CheckCircle sx={{ fontSize: 16 }} />
                      Đã xác thực
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      mb: 2, 
                      color: '#1a237e',
                      lineHeight: 1.3
                    }}>
                      {project.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      color: '#6c757d', 
                      mb: 3,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {project.description}
                    </Typography>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
                          Đã quyên góp
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                          {formatPercentage(project.raised, project.target)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={formatPercentage(project.raised, project.target)}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: '#e9ecef',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#ffd700',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                          {formatCurrency(project.raised)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d' }}>
                          / {formatCurrency(project.target)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                          {project.donors}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d' }}>
                          nhà hảo tâm
                        </Typography>
                      </Box>
                    </Box>

                    {/* Location & Time */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#6c757d' }} />
                        <Typography variant="caption" sx={{ color: '#6c757d' }}>
                          {project.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 16, color: '#6c757d' }} />
                        <Typography variant="caption" sx={{ color: '#6c757d' }}>
                          Còn {project.daysLeft} ngày
                        </Typography>
                      </Box>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                      {project.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f8f9fa', 
                            color: '#1a237e',
                            fontSize: '11px',
                            height: 24
                          }} 
                        />
                      ))}
                    </Box>

                    {/* Organizer */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar 
                        src={project.organizer.avatar} 
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a237e' }}>
                          {project.organizer.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6c757d' }}>
                          Tổ chức
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleDonate(project)}
                        sx={{
                          bgcolor: '#ffd700',
                          color: '#1a237e',
                          fontWeight: 700,
                          '&:hover': { bgcolor: '#ffed4e' }
                        }}
                      >
                        Quyên Góp Ngay
                      </Button>
                      <IconButton
                        onClick={() => handleLikeProject(project.id)}
                        sx={{ 
                          color: likedProjects.has(project.id) ? '#e91e63' : '#6c757d',
                          border: 1,
                          borderColor: likedProjects.has(project.id) ? '#e91e63' : '#dee2e6'
                        }}
                      >
                        {likedProjects.has(project.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      <IconButton sx={{ color: '#6c757d', border: 1, borderColor: '#dee2e6' }}>
                        <Share />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Load More Button */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: '#ffd700', 
                color: '#1a237e',
                px: 4,
                py: 1.5,
                '&:hover': { 
                  borderColor: '#ffed4e',
                  bgcolor: '#fff9c4'
                }
              }}
            >
              Xem Thêm Dự Án
            </Button>
          </Box>
        </Container>

        {/* Donation Dialog */}
        <Dialog 
          open={showDonationDialog} 
          onClose={() => setShowDonationDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Favorite sx={{ color: '#ffd700' }} />
              Quyên Góp Cho Dự Án
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedProject && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {selectedProject.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#6c757d' }}>
                    Đã quyên góp: {formatCurrency(selectedProject.raised)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6c757d' }}>
                    Mục tiêu: {formatCurrency(selectedProject.target)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={formatPercentage(selectedProject.raised, selectedProject.target)}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': { bgcolor: '#ffd700' }
                  }}
                />
              </Box>
            )}

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Loại quyên góp</FormLabel>
              <RadioGroup
                value={donationType}
                onChange={(e) => setDonationType(e.target.value)}
              >
                <FormControlLabel value="one-time" control={<Radio />} label="Quyên góp một lần" />
                <FormControlLabel value="monthly" control={<Radio />} label="Quyên góp hàng tháng" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Số tiền quyên góp (VNĐ)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Họ tên"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Lời nhắn (tùy chọn)"
              multiline
              rows={3}
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              placeholder="Chia sẻ lý do quyên góp của bạn..."
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
              }
              label="Quyên góp ẩn danh"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowDonationDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleDonationSubmit}
              sx={{
                bgcolor: '#ffd700',
                color: '#1a237e',
                fontWeight: 700,
                '&:hover': { bgcolor: '#ffed4e' }
              }}
            >
              Xác Nhận Quyên Góp
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default DonationPage;
