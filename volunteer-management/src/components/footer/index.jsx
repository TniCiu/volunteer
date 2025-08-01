import { Box, Typography, Container, Grid, Link, Button, IconButton, Stack } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from "react-router-dom";

const PRIMARY_GRADIENT = "linear-gradient(90deg, #1a237e 0%, #ffe066 160%)";


const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: "#f5f7fa", color: "#222", pt: 6, mt: 8, borderTopLeftRadius: 32, borderTopRightRadius: 32, boxShadow: 3 }}>
      {/* CTA Section */}
      <Box
        sx={{
          background: PRIMARY_GRADIENT,
          color: '#fff',
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          mb: 5,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          boxShadow: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Cùng lan tỏa yêu thương – Đăng ký trở thành tình nguyện viên ngay hôm nay!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            “Một hành động nhỏ có thể thay đổi cả thế giới của ai đó.”
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<VolunteerActivismIcon />}
          sx={{
            fontWeight: 700,
            fontSize: 18,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            boxShadow: 2,
            background: '#ffd700',
            color: '#1a237e',
            '&:hover': { background: '#ffe066', color: '#1a237e' },
          }}
          onClick={() => navigate('/hoat-dong')}
        >
          Đăng ký tình nguyện
        </Button>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tình Nguyện Viên
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Kết nối cộng đồng – Lan tỏa yêu thương.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" href="#" sx={{ color: '#1976d2' }} aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" href="#" sx={{ color: '#E1306C' }} aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" href="#" sx={{ color: '#FF0000' }} aria-label="YouTube">
                <YouTubeIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Liên kết nhanh
            </Typography>
            <Box>
              <Link href="/" underline="hover" color="inherit" display="block" mb={1}>
                Trang chủ
              </Link>
              <Link href="/hoat-dong" underline="hover" color="inherit" display="block" mb={1}>
                Hoạt động
              </Link>
              <Link href="/quyen-gop" underline="hover" color="inherit" display="block" mb={1}>
                Quyên góp
              </Link>
              <Link href="/dang-ky-tinh-nguyen-vien" underline="hover" color="inherit" display="block">
                Đăng ký TNV
              </Link>
            </Box>
          </Grid>

          <Grid item xs={6} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Liên hệ
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <EmailIcon fontSize="small" sx={{ color: '#1976d2' }} />
              <Typography variant="body2">contact@tinhnguyenvien.org</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <PhoneIcon fontSize="small" sx={{ color: '#4caf50' }} />
              <Typography variant="body2">0123 456 789</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon fontSize="small" sx={{ color: '#E1306C' }} />
              <Typography variant="body2">123 Đường Tình Nguyện, TP. Hà Nội</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={4}>
          <Typography variant="body2" fontSize={13} color="#888">
            © {new Date().getFullYear()} Tình Nguyện Viên. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
