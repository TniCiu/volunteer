import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  SupervisorAccount as LeaderIcon,
  Article as ArticleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { getStatisticsAPI } from '../../../../../apis';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        const response = await getStatisticsAPI();
        setStats(response.data);
        setError(null)
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card sx={{
      height: 180,
      width: '100%',
      p: 3,
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      border: `1px solid ${color}20`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}30`
      }
    }}>
      <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 1 }}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            {subtitle && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 70, height: 70, boxShadow: `0 4px 12px ${color}40` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: '1px solid #ccc' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Không có dữ liệu thống kê</Alert>
      </Box>
    );
  }

  // Chuyển đổi dữ liệu từ API để phù hợp với biểu đồ
  const monthlyStatsData = stats.monthly_stats?.map(item => ({
    month: item.month,
    volunteers: item.volunteers || 0,
    leaders: item.leaders || 0,
    activities: stats.monthly_activities?.find(act => act.month === item.month)?.activities || 0
  })) || [];

  return (
    <Box>
      {/* Thống kê tổng quan */}
      <Grid container spacing={12} sx={{ mb: 6 }}>
        {[
          {
            title: 'Tình nguyện viên',
            value: stats.overview?.volunteers || 0,
            icon: <PeopleIcon />,
            color: '#2196F3',
            subtitle: 'Tổng số tình nguyện viên'
          },
          {
            title: 'Leader',
            value: stats.overview?.leaders || 0,
            icon: <LeaderIcon />,
            color: '#FF9800',
            subtitle: 'Tổng số leader'
          },
          {
            title: 'Admin',
            value: stats.overview?.admins || 0,
            icon: <ArticleIcon />,
            color: '#4CAF50',
            subtitle: 'Tổng số admin'
          },
          {
            title: 'Hoạt động',
            value: stats.overview?.activities || 0,
            icon: <EventIcon />,
            color: '#9C27B0',
            subtitle: 'Tổng số hoạt động'
          }
        ].map((item, index) => (
          <Grid item xs={6} sm={3} key={index} sx={{ display: 'flex' }}>
            <Box sx={{ width: '260px' }}>
              <StatCard {...item} />
            </Box>
          </Grid>
        ))}
      </Grid>


      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Biểu đồ cột - Thống kê tăng trưởng theo tháng */}
        <Grid item xs={12} lg={6} sx={{ display: 'flex' }}>
          <Box sx={{ width: '100%' }}>
            <Card sx={{ height: 500, width: 920, p: 3, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
                Thống kê tăng trưởng theo tháng
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="volunteers" fill="#2196F3" name="Tình nguyện viên" />
                    <Bar dataKey="leaders" fill="#FF9800" name="Leader" />
                    <Bar dataKey="activities" fill="#9C27B0" name="Hoạt động" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ p: 3, height: 500 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a237e' }}>
              Top tình nguyện viên tích cực
            </Typography>
            <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
              {stats.top_volunteers?.map((volunteer, index) => (
                <Box key={volunteer.id} sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Avatar sx={{ mr: 3, bgcolor: '#2196F3', width: 60, height: 60 }}>
                    {volunteer.avatar ? (
                      <img src={volunteer.avatar} alt={volunteer.name} style={{ width: '100%', height: '100%' }} />
                    ) : (
                      volunteer.name.charAt(0)
                    )}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {volunteer.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {volunteer.approved_registrations} hoạt động đã tham gia
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    #{index + 1}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

      </Grid>


      {/* Thống kê đăng ký và top tình nguyện viên */}

    </Box>
  );
};

export default Statistics; 