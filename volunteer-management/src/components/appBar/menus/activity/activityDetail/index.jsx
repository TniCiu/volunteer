import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Container,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    IconButton,
    Tooltip,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ArrowBack,
    LocationOn,
    Favorite,
    Share,
    Phone,
    Email,
    CheckCircle,
    Schedule,
    DirectionsWalk,
    EmojiEvents,
    Facebook,
    WhatsApp,
    ContentCopy,
    VolunteerActivism,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import AppBar from '../../../index.jsx';
import Footer from '../../../../footer/index.jsx';
import { getActivityByIdAPI } from '../../../../../apis';
import { useRegistrationUpdates } from '../../../../../hooks/useRegistrationUpdates';
import { toast } from 'react-toastify';

const ActivityDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { lastUpdate, getStatusText } = useRegistrationUpdates(id);
    const [isLiked, setIsLiked] = useState(false);
    const [isJoined] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRegistration, setUserRegistration] = useState(null);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        fetchActivityDetail();
    }, [id]);

    // Lắng nghe cập nhật trạng thái đăng ký real-time
    useEffect(() => {
        if (lastUpdate && lastUpdate.activityId == id) {
            console.log('🔄 ActivityDetail: Processing registration update:', lastUpdate);
            console.log('🔄 ActivityDetail: Current userRegistration:', userRegistration);
            
            // Kiểm tra xem update có thực sự cần thiết không
            if (userRegistration && userRegistration.status === lastUpdate.status) {
                console.log('🔄 ActivityDetail: Status already up to date, skipping update');
                return;
            }
            
            // Cập nhật trạng thái đăng ký của user
            setUserRegistration(prev => {
                const newRegistration = {
                    ...prev,
                    status: lastUpdate.status
                };
                console.log('🔄 ActivityDetail: Updated userRegistration:', newRegistration);
                return newRegistration;
            });
            
            // Refresh lại dữ liệu hoạt động để cập nhật số lượng đăng ký
            // Chỉ fetch nếu không đang fetch
            if (!isFetchingRef.current) {
                console.log('🔄 ActivityDetail: Refreshing activity data...');
                fetchActivityDetail();
            } else {
                console.log('🔄 ActivityDetail: Already fetching, skipping...');
            }
            
            // Thông báo toast đã được xử lý trong SocketContext
            // Không cần hiển thị thêm ở đây
        }
    }, [lastUpdate, id]); // Loại bỏ getStatusText khỏi dependency array

    const fetchActivityDetail = async () => {
        if (isFetchingRef.current) {
            console.log('🔄 ActivityDetail: Already fetching, returning...');
            return;
        }
        
        try {
            isFetchingRef.current = true;
            setLoading(true);
            console.log('🔄 ActivityDetail: Starting fetch...');
            
            const data = await getActivityByIdAPI(id);
            
            // Gói thành Activity object
            const Activity = {
                ...data,
                participants: {
                    current: data.participants_current,
                    max: data.participants_max,
                    percentage: data.participants_percentage
                },
                image: data.image || 'https://homepage.momocdn.net/blogscontents/momo-upload-api-240129140308-638421337889338088.jpg',
                tags: data.tags ? data.tags.map(tag => `#${tag.name}`) : ['#TìnhNguyện'],
                badgeColor: '#ff4757',
                countdown: '5 ngày',
                likes: 128,
                shares: 89,
                requirements: [
                    'Tuổi từ 18 trở lên',
                    'Có sức khỏe tốt, thích nghi với khí hậu vùng cao',
                    'Có tinh thần tình nguyện và sẵn sàng hỗ trợ cộng đồng',
                    'Có thể làm việc theo nhóm và thích nghi với điều kiện cơ bản',
                    'Có kinh nghiệm chăm sóc trẻ em hoặc y tế (ưu tiên)'
                ],
                benefits: [
                    'Được cấp chứng chỉ tình nguyện có giá trị ',
                    'Trải nghiệm văn hóa độc đáo của người dân tộc ',
                    'Phát triển kỹ năng làm việc nhóm ,kỹ năng giao tiếp và lãnh đạo ',
                    'Được hỗ trợ chi phí ăn uống và di chuyển',
                    'Cơ hội kết nối với cộng đồng tình nguyện viên'
                ],
                organizer: data.leader
            };
            
            setActivity(Activity);
            
            // Kiểm tra xem user hiện tại có trong danh sách đăng ký không
            const userId = localStorage.getItem('id');
            if (userId && data.registrations) {
                const userReg = data.registrations.find(reg => reg.user_id == userId);
                setUserRegistration(userReg || null);
            }
            
            setError(null);
            console.log('🔄 ActivityDetail: Fetch completed successfully');
        } catch (err) {
            console.error('Error fetching activity detail:', err);
            setError('Không thể tải thông tin hoạt động');
            toast.error('Không thể tải thông tin hoạt động');
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    const handleJoin = async () => {
        console.log('🎯 handleJoin function called!');
        
        // Kiểm tra đăng nhập trước khi chuyển hướng
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        
        if (!token || !userId) {
            console.log('❌ Missing token or userId');
            toast.error('Vui lòng đăng nhập để đăng ký tham gia hoạt động');
            navigate('/dang-nhap');
            return;
        }
        
        // Kiểm tra xem user đã đăng ký hoạt động này chưa
        if (userRegistration) {
            const statusText = userRegistration.status === 'approved' ? 'đã được duyệt' : 
                              userRegistration.status === 'pending' ? 'đang chờ duyệt' : 
                              userRegistration.status === 'rejected' ? 'đã bị từ chối' : 'đã đăng ký';
            
            toast.info(`Bạn đã tham gia hoạt động này rồi! (Trạng thái: ${statusText})`);
            return;
        }
        
        // Chuyển hướng đến trang đăng ký
        console.log('Navigating to registration page with ID:', id);
        navigate(`/dang-ky-hoat-dong/${id}`);
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const text = `Tham gia cùng tôi trong hoạt động: ${activity.title}`;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                break;
            case 'zalo':
                window.open(`https://zalo.me/share?u=${encodeURIComponent(url)}&t=${encodeURIComponent(text)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Đã copy link vào clipboard!');
                break;
            default:
                break;
        }
        setShowShareDialog(false);
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

    if (error || !activity) {
        return (
            <>
                <AppBar />
                <Container sx={{ py: 8 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error || 'Không tìm thấy thông tin hoạt động'}
                    </Alert>
                    <Button variant="contained" onClick={fetchActivityDetail}>
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
                {/* Hero Banner */}
                <Box sx={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
                    <img
                        src={activity.image}
                        alt={activity.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Container maxWidth="lg">
                            <Box sx={{ textAlign: 'center', color: 'white' }}>

                                <Typography variant="h2" sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: '32px', md: '48px' },
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>
                                    {activity.title}
                                </Typography>
                                <Typography variant="h5" sx={{
                                    fontWeight: 300,
                                    mb: 3,
                                    fontSize: { xs: '18px', md: '24px' },
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}>
                                    {activity.slogan}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    {activity.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.9)',
                                                color: '#1a237e',
                                                fontSize: '12px',
                                                height: 28,
                                                fontWeight: 500
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Box>

                {/* Navigation Header */}
                <Box sx={{ bgcolor: '#fff', borderBottom: 1, borderColor: '#e9ecef' }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
                            <IconButton onClick={() => navigate('/hoat-dong')} sx={{ mr: 2 }}>
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                Chi Tiết Hoạt Động
                            </Typography>
                        </Box>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Grid container spacing={4}>
                        {/* Main Content */}
                        <Grid item xs={12} lg={8}>
                            {/* Quick Info Card */}
                            <Card sx={{ mb: 4, bgcolor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                        Thời gian
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {activity.date}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                        Giờ hoạt động
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {activity.time}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{
                                            width: '1px',
                                            bgcolor: '#e9ecef',
                                            mx: 3,
                                            display: { xs: 'none', sm: 'block' }
                                        }} />

                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                        Địa điểm
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {activity.location}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                        Cần tuyển
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {activity.participants.max} TNV
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" sx={{ color: '#6c757d', mb: 1 }}>
                                            Tiến độ đăng ký
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={activity.participants.percentage}
                                            sx={{
                                                height: 12,
                                                borderRadius: 6,
                                                bgcolor: '#e9ecef',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: '#ffd700'
                                                }
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: '#6c757d', mt: 1 }}>
                                            Đã có {activity.participants.current} TNV đăng ký ({activity.participants.percentage}%)
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant={userRegistration ? "outlined" : "contained"}
                                            size="large"
                                            onClick={handleJoin}
                                            startIcon={<VolunteerActivism />}
                                            sx={{
                                                bgcolor: userRegistration ? 'transparent' : '#ffd700',
                                                color: userRegistration ? '#ffd700' : '#1a237e',
                                                borderColor: '#ffd700',
                                                fontWeight: 700,
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 3,
                                                textTransform: 'none',
                                                fontSize: '16px',
                                                '&:hover': {
                                                    bgcolor: userRegistration ? '#ffd700' : '#ffed4e',
                                                    color: userRegistration ? '#1a237e' : '#1a237e'
                                                }
                                            }}
                                        >
                                            {userRegistration 
                                                ? (userRegistration.status === 'approved' ? 'Đã Được Duyệt' : 
                                                   userRegistration.status === 'pending' ? 'Đang Chờ Duyệt' : 
                                                   userRegistration.status === 'rejected' ? 'Đã Từ Chối' : 'Đã Đăng Ký')
                                                : 'Tôi muốn đồng hành'
                                            }
                                        </Button>

                                        <IconButton
                                            onClick={() => setIsLiked(!isLiked)}
                                            sx={{
                                                color: isLiked ? '#e91e63' : '#6c757d',
                                                border: 1,
                                                borderColor: isLiked ? '#e91e63' : '#dee2e6',
                                                '&:hover': {
                                                    bgcolor: isLiked ? '#fce4ec' : '#f8f9fa'
                                                }
                                            }}
                                        >
                                            <Favorite />
                                        </IconButton>

                                        <IconButton
                                            onClick={() => setShowShareDialog(true)}
                                            sx={{
                                                color: '#6c757d',
                                                border: 1,
                                                borderColor: '#dee2e6',
                                                '&:hover': {
                                                    bgcolor: '#f8f9fa'
                                                }
                                            }}
                                        >
                                            <Share />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Description */}
                            <Card sx={{ mb: 4 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                        Mô Tả Chi Tiết
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        lineHeight: 1.8,
                                        color: '#495057',
                                        fontSize: '16px'
                                    }}>
                                        {activity.description}
                                    </Typography>
                                </CardContent>
                            </Card>



                            {/* Timeline */}
                            <Card sx={{ mb: 4 }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                        Lịch Trình Chi Tiết
                                    </Typography>
                                    <List>
                                        {activity.timeline.map((item, index) => (
                                            <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                <ListItemIcon>
                                                    <Schedule sx={{ color: '#ffd700', fontSize: 24 }} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box>
                                                            <Typography variant="h6" sx={{
                                                                fontWeight: 600,
                                                                color: '#1a237e',
                                                                mb: 0.5
                                                            }}>
                                                                {item.day} - {item.time}
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: '#495057' }}>
                                                                {item.activity}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>

                            {/* Organizer & Location Row */}
                            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'nowrap' }}>
                                <Card sx={{ flex: 1, minWidth: 0 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                            Tổ Chức
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar
                                                src={activity?.organizer?.avatar}
                                                sx={{ width: 60, height: 60, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {activity?.organizer?.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                                    Tổ chức tình nguyện
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Phone sx={{ fontSize: 18, color: '#4ecdc4' }} />
                                                <Typography variant="body2">
                                                    {activity.organizer?.phone}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Email sx={{ fontSize: 18, color: '#ff6b6b' }} />
                                                <Typography variant="body2">
                                                    {activity.organizer?.email}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Card sx={{ flex: 1, minWidth: 0 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                            Địa Điểm
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <LocationOn sx={{ color: '#45b7d1' }} />
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {activity.location}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#6c757d', mb: 3 }}>
                                            {activity.address}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DirectionsWalk />}
                                            fullWidth
                                            sx={{
                                                borderColor: '#ffd700',
                                                color: '#1a237e',
                                                '&:hover': {
                                                    borderColor: '#ffed4e',
                                                    bgcolor: '#fff9c4'
                                                }
                                            }}
                                            onClick={() =>
                                                window.open(
                                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.address)}`,
                                                    '_blank'
                                                )
                                            }
                                        >
                                            Chỉ Đường
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'nowrap' }}>
                                <Card sx={{ flex: 1, minWidth: 0 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                            Yêu Cầu Tham Gia
                                        </Typography>
                                        <List>
                                            {activity.requirements.map((req, index) => (
                                                <ListItem key={index} sx={{ px: 0 }}>
                                                    <ListItemIcon>
                                                        <CheckCircle sx={{ color: '#2ed573', fontSize: 20 }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={req}
                                                        sx={{
                                                            '& .MuiListItemText-primary': {
                                                                fontSize: '14px',
                                                                lineHeight: 1.4,
                                                                wordBreak: 'break-word'
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>

                                <Card sx={{ flex: 1, minWidth: 0 }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                                            Quyền Lợi
                                        </Typography>
                                        <List>
                                            {activity.benefits.map((benefit, index) => (
                                                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                                                    <ListItemIcon>
                                                        <EmojiEvents sx={{ color: '#ffd700', fontSize: 24 }} />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={benefit}
                                                        sx={{
                                                            '& .MuiListItemText-primary': {
                                                                fontSize: '14px',
                                                                lineHeight: 1.4,
                                                                fontWeight: 500,
                                                                wordBreak: 'break-word'
                                                            }
                                                        }}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Grid>

                        {/* Sidebar */}
                    </Grid>
                </Container>

                {/* Share Dialog */}
                <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
                    <DialogTitle>Lan tỏa hoạt động đến bạn bè!</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', py: 2 }}>
                            <IconButton
                                onClick={() => handleShare('facebook')}
                                sx={{
                                    bgcolor: '#1877f2',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#166fe5' }
                                }}
                            >
                                <Facebook />
                            </IconButton>
                            <IconButton
                                onClick={() => handleShare('zalo')}
                                sx={{
                                    bgcolor: '#0068ff',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#0056cc' }
                                }}
                            >
                                <WhatsApp />
                            </IconButton>
                            <IconButton
                                onClick={() => handleShare('copy')}
                                sx={{
                                    bgcolor: '#6c757d',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#5a6268' }
                                }}
                            >
                                <ContentCopy />
                            </IconButton>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowShareDialog(false)}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Footer />
        </>
    );
};

export default ActivityDetail; 