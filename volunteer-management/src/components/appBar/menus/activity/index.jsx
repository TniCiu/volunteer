import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Container,
  Tabs,
  Tab,
  IconButton,
  Grid,
  Avatar,
  Badge,
  Tooltip,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  CalendarToday,
  Group,
  LocationOn,
  Favorite,
  Share,
  Search,
  Person,
  AccessTime,
  TrendingUp,
  Star,
  LocalFireDepartment,
  Label
} from '@mui/icons-material';
import AppBar from '../../index.jsx';
import Footer from '../../../footer/index.jsx';
import { getAllActivitiesAPI } from '../../../../apis';
import { useSocket } from '../../../../contexts/SocketContext';
import { toast } from 'react-toastify';

const ActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { registrationUpdates } = useSocket();
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activities, setActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  // Lắng nghe cập nhật trạng thái đăng ký real-time
  useEffect(() => {
    if (registrationUpdates.length > 0) {
      const latestUpdate = registrationUpdates[registrationUpdates.length - 1];
      
      // Cập nhật trạng thái đăng ký trong danh sách hoạt động
      setActivities(prevActivities => 
        prevActivities.map(activity => {
          if (activity.id == latestUpdate.activityId) {
            return {
              ...activity,
              isRegistered: true,
              registrationStatus: latestUpdate.status
            };
          }
          return activity;
        })
      );
      
      setAllActivities(prevActivities => 
        prevActivities.map(activity => {
          if (activity.id == latestUpdate.activityId) {
            return {
              ...activity,
              isRegistered: true,
              registrationStatus: latestUpdate.status
            };
          }
          return activity;
        })
      );
    }
  }, [registrationUpdates]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // Lấy userId từ localStorage
      const userId = localStorage.getItem('id');
      const data = await getAllActivitiesAPI(userId);
      // Transform API data to match the original structure
      const transformedData = data.map(activity => ({
        id: activity.id,
        title: activity.title,
        date: activity.date,
        participants: `${activity.participants_current}/${activity.participants_max}`,
        location: activity.location,
        description: activity.description,
        likes: 65, // Default values for now
        shares: 59,
        image: activity.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        tags: activity.tags ? activity.tags.map(tag => `#${tag.name}`) : ['#TìnhNguyện'],
        originalTags: activity.tags || [],
        badge: activity.participants_percentage >= 80 ? 'GẦN ĐẦY' : 'MỚI',
        badgeColor: activity.participants_percentage >= 80 ? '#ffa502' : '#2ed573',
        countdown: '3 ngày',
        isNew: activity.participants_percentage < 50,
        isRegistered: activity.isRegistered || false,
        registrationStatus: activity.registrationStatus || null,
        registrations: activity.registrations || []
      }));
      
      setAllActivities(transformedData);
      setActivities(transformedData);
      
      // Extract all unique tags
      const tags = new Set();
      transformedData.forEach(activity => {
        activity.originalTags.forEach(tag => {
          tags.add(tag.name);
        });
      });
      setAllTags(Array.from(tags));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Không thể tải danh sách hoạt động');
      toast.error('Không thể tải danh sách hoạt động');
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagName) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(tag => tag !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(newSelectedTags);
    
    if (newSelectedTags.length === 0) {
      setActivities(allActivities);
    } else {
      const filteredActivities = allActivities.filter(activity =>
        activity.originalTags.some(tag => newSelectedTags.includes(tag.name))
      );
      setActivities(filteredActivities);
    }
  };

  const getTagColor = (tagName) => {
    const colors = [
      '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0', '#fce4ec',
      '#f1f8e9', '#e0f2f1', '#fafafa', '#e8eaf6', '#fff8e1'
    ];
    const colorIndex = tagName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const getTagTextColor = (tagName) => {
    const colors = [
      '#1976d2', '#7b1fa2', '#388e3c', '#f57c00', '#c2185b',
      '#689f38', '#00695c', '#424242', '#3f51b5', '#f9a825'
    ];
    const colorIndex = tagName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  // Tính toán số lượng hoạt động theo trạng thái (từ allActivities)
  const allActivitiesCount = allActivities.length;
  const notJoinedCount = allActivities.filter(activity => !activity.isRegistered).length;
  const joinedCount = allActivities.filter(activity => activity.isRegistered).length;
  const approvedCount = allActivities.filter(activity => activity.registrationStatus === 'approved').length;
  const pendingCount = allActivities.filter(activity => activity.registrationStatus === 'pending').length;

  const tabs = [
    { label: `Tất Cả (${allActivitiesCount})`, count: allActivitiesCount },
    { label: `Chưa Tham Gia (${notJoinedCount})`, count: notJoinedCount },
    { label: `Đã Tham Gia (${joinedCount})`, count: joinedCount },
    { label: `Đã Yêu Thích (0)`, count: 0 },
    { label: `Dành Cho Bạn (${allActivities.filter(activity => !activity.isRegistered && activity.participants_percentage < 80).length})`, count: allActivities.filter(activity => !activity.isRegistered && activity.participants_percentage < 80).length }
  ];

  const handleJoin = (activity) => {
    if (activity.isRegistered) {
      // Nếu đã đăng ký, hiển thị thông báo
      toast.info(`Bạn đã đăng ký hoạt động này với trạng thái: ${
        activity.registrationStatus === 'approved' ? 'Đã được duyệt' : 
        activity.registrationStatus === 'pending' ? 'Đang chờ duyệt' : 
        activity.registrationStatus === 'rejected' ? 'Đã bị từ chối' : 'Đã đăng ký'
      }`);
      return;
    }
    // Chuyển hướng trực tiếp đến trang đăng ký
    console.log('Navigating to registration page with ID:', activity.id);
    navigate(`/dang-ky-hoat-dong/${activity.id}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Lọc hoạt động dựa trên tab được chọn
    let filteredActivities = allActivities;
    
    switch (newValue) {
      case 0: // Tất Cả
        filteredActivities = allActivities;
        break;
      case 1: // Chưa Tham Gia
        filteredActivities = allActivities.filter(activity => !activity.isRegistered);
        break;
      case 2: // Đã Tham Gia
        filteredActivities = allActivities.filter(activity => activity.isRegistered);
        break;
      case 3: // Đã Yêu Thích (tạm thời chưa có logic)
        filteredActivities = [];
        break;
      case 4: // Dành Cho Bạn (có thể là hoạt động phù hợp với user)
        filteredActivities = allActivities.filter(activity => 
          !activity.isRegistered && activity.participants_percentage < 80
        );
        break;
      default:
        filteredActivities = allActivities;
    }
    
    setActivities(filteredActivities);
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'HOT':
        return <LocalFireDepartment sx={{ fontSize: 16 }} />;
      case 'MỚI':
        return <Star sx={{ fontSize: 16 }} />;
      case 'GẦN ĐẦY':
        return <TrendingUp sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <>
        <AppBar />
        <Container sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchActivities}>
            Thử lại
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AppBar />
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Navigation Tabs */}
        <Box sx={{ 
          bgcolor: '#fff', 
          borderBottom: 1, 
          borderColor: '#e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <Container maxWidth="xl">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: '#6c757d',
                  fontWeight: 500,
                  fontSize: '14px',
                  textTransform: 'none',
                  minHeight: 56,
                  px: 3,
                  '&.Mui-selected': {
                    color: '#1a237e',
                    fontWeight: 600
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ffd700',
                  height: 3,
                  borderRadius: '2px'
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  sx={{
                    borderBottom: activeTab === index ? '3px solid #ffd700' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                />
              ))}
            </Tabs>
          </Container>
        </Box>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <Box sx={{ 
            bgcolor: '#fff', 
            borderBottom: 1, 
            borderColor: '#e9ecef',
            py: 2
          }}>
            <Container maxWidth="xl">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Label sx={{ color: '#1a237e', fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                  Lọc theo tags:
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {allTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    sx={{
                      bgcolor: selectedTags.includes(tag) ? '#1a237e' : getTagColor(tag),
                      color: selectedTags.includes(tag) ? 'white' : getTagTextColor(tag),
                      fontWeight: selectedTags.includes(tag) ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                        bgcolor: selectedTags.includes(tag) ? '#283593' : getTagColor(tag),
                      }
                    }}
                  />
                ))}
                {selectedTags.length > 0 && (
                  <Chip
                    label="Xóa tất cả"
                    onClick={() => {
                      setSelectedTags([]);
                      setActivities(allActivities);
                    }}
                    sx={{
                      bgcolor: '#f44336',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#d32f2f',
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      }
                    }}
                  />
                )}
              </Box>
            </Container>
          </Box>
        )}

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Grid container spacing={2}>
            {activities.map((activity) => (
              <Grid item xs={12} md={4} key={activity.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      transform: 'translateY(-4px)',
                    }
                  }}
                  onMouseEnter={() => setHoveredCard(activity.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Left Side - Image */}
                  <Box sx={{ 
                    width: { xs: '100%', md: '50%' },
                    height: { xs: '160px', md: 'auto' },
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 2
                    }}>
                      <Chip
                        icon={getBadgeIcon(activity.badge)}
                        label={activity.badge}
                        sx={{
                          bgcolor: activity.badgeColor,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '11px',
                          height: 24,
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                    </Box>

                    {/* Countdown Badge */}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2
                    }}>
                      <Chip
                        icon={<AccessTime sx={{ fontSize: 12 }} />}
                        label={activity.countdown}
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          fontWeight: 500,
                          fontSize: '10px',
                          height: 20,
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                    </Box>

                    <CardMedia
                      component="img"
                      height="100%"
                      image={activity.image}
                      alt={activity.title}
                      sx={{ 
                        objectFit: 'contain',
                        backgroundColor: '#f8f9fa',
                        transition: 'transform 0.4s ease',
                        transform: hoveredCard === activity.id ? 'scale(1.05)' : 'scale(1)'
                      }}
                    />
                  </Box>

                  {/* Right Side - Content */}
                  <Box sx={{ 
                    width: { xs: '100%', md: '50%' },
                    display: 'flex', 
                    flexDirection: 'column',
                    p: 2
                  }}>
                    {/* Tags */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                      {activity.originalTags.map((tag, index) => (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          onClick={() => handleTagClick(tag.name)}
                          sx={{
                            bgcolor: getTagColor(tag.name),
                            color: getTagTextColor(tag.name),
                            fontSize: '10px',
                            height: 18,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: 1,
                              bgcolor: getTagColor(tag.name),
                            }
                          }}
                        />
                      ))}
                    </Box>

                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '16px',
                        lineHeight: 1.4,
                        mb: 2,
                        color: '#1a237e',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '44px'
                      }}
                    >
                      {activity.title}
                    </Typography>

                    {/* Metadata */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarToday sx={{ fontSize: 18, color: '#ff6b6b' }} />
                        <Typography variant="body2" sx={{ color: '#495057', fontSize: '14px', fontWeight: 500 }}>
                          {activity.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Group sx={{ fontSize: 18, color: '#4ecdc4' }} />
                        <Typography variant="body2" sx={{ color: '#495057', fontSize: '14px', fontWeight: 500 }}>
                          {activity.participants} người tham gia
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#45b7d1' }} />
                        <Typography variant="body2" sx={{ color: '#495057', fontSize: '14px', fontWeight: 500 }}>
                          {activity.location}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#6c757d',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '66px'
                      }}
                    >
                      {activity.description}
                    </Typography>

                    {/* Engagement and Action */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid #e9ecef'
                    }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Tooltip title="Lượt thích">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Favorite sx={{ fontSize: 18, color: '#e91e63' }} />
                            <Typography variant="body2" sx={{ color: '#495057', fontSize: '13px', fontWeight: 600 }}>
                              {activity.likes}
                            </Typography>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Lượt chia sẻ">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Share sx={{ fontSize: 18, color: '#6c757d' }} />
                            <Typography variant="body2" sx={{ color: '#495057', fontSize: '13px', fontWeight: 600 }}>
                              {activity.shares}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/hoat-dong/${activity.id}`)}
                        sx={{
                          bgcolor: '#ffd700',
                          color: '#1a237e',
                          fontWeight: 700,
                          borderRadius: 2.5,
                          px: 3,
                          py: 1.2,
                          textTransform: 'none',
                          fontSize: '14px',
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: '#ffed4e',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)'
                          }
                        }}
                      >
                        Chi Tiết
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {activities.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có hoạt động nào
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy quay lại sau để xem các hoạt động mới
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ActivityPage;