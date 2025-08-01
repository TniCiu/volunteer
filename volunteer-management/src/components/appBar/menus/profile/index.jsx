import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { fetchUserInfoAPI, updateUserInfoAPI } from '../../../../apis';
import { useConfirm } from "material-ui-confirm";
import { toast } from 'react-toastify';
import Compressor from 'compressorjs'
import UploadFileIcon from '@mui/icons-material/CloudUpload'
import { useAuth } from '../../auth/AuthContext'; // Đảm bảo đã import
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fade from '@mui/material/Fade';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setname] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [phone, setPhone] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('id');
    if (id) {
      try {
        fetchUserInfoAPI(id).then(userData => {
          console.log(userData.role);
          setUser(userData);
          setname(userData.name);
          setEmail(userData.email);
          setAvatar(userData.avatar);
          setRole(userData.role);
          setPhone(userData.phone || '');
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }, []);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAdminDashboard = () => {
    handleClose();
    navigate('/admin/dashboard');
  };

  const isAdminOrLeader = () => {
    return role === 'admin' || role === 'leader';
  };

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const id = localStorage.getItem('id');
      const updatedData = {
        name,
        ...(password && { password }),
        ...(email && { email }),
        ...(phone && { phone }),
        role: role || '', 
        avatar: selectedImage || avatar
      };
      console.log(updatedData);
      await updateUserInfoAPI(id, updatedData);
      setUser(updatedData);
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        handleDialogClose();
      }, 1000);
    } catch (error) {
      toast.error('❌ Cập nhật hồ sơ thất bại. Vui lòng thử lại!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)',
          color: 'white',
          fontWeight: 'bold'
        }
      });
    } finally {
      setIsUpdating(false);
    }
  };
  

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6, // Set quality to 60%
        success(result) {
          resolve(result);
        },
        error(error) {
          reject(error);
        },
      });
    });
  };
  
  // Update handleImageChange function to compress the image before setting it
  // Update handleImageChange function to check the file size before compression
const handleImageChange = async (event) => {
  const file = event.target.files[0];
  // Kiểm tra kích thước của tệp (đơn vị: byte)
  const fileSizeInBytes = file.size;
  // Giới hạn kích thước tệp (vd: 5MB)
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (fileSizeInBytes > maxSizeInBytes) {
    // Hiển thị thông báo lỗi khi kích thước tệp vượt quá giới hạn
    console.error('File size exceeds the limit.');
    return;
  }

  try {
    const compressedImage = await compressImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result); // Update selectedImage to the compressed image URL
    };
    if (compressedImage) {
      reader.readAsDataURL(compressedImage);
    }
  } catch (error) {
    console.error('Error compressing image:', error);
    // Handle error
  }
};


  const { logout } = useAuth(); 

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };
  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    logout();
    window.location.href = '/dang-nhap';
  };
  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <Box>
      <Tooltip title="Cài đặt tài khoản">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 40, height: 40, boxShadow: 2 }}
            alt={user ? user.name : 'Đang tải...'}
            src={user ? user.avatar : ''}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'account-button'
        }}
      >
        {/* MenuItem đẹp hơn */}
        <MenuItem onClick={handleDialogOpen} sx={{ py: 2, borderRadius: 2, mb: 1, '&:hover': { bgcolor: '#e3f0ff' } }}>
          <Avatar sx={{ width: 36, height: 36, mr: 2, boxShadow: 1 }} src={user ? user.avatar : ''} />
          <Typography sx={{ fontWeight: 600, color: '#1a237e', fontSize: 17 }}>Hồ sơ của tôi</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ py: 2, borderRadius: 2, mb: 1, '&:hover': { bgcolor: '#e3f0ff' } }}>
          <ListItemIcon>
            <Settings fontSize="medium" sx={{ color: '#1a237e' }} />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 500, color: '#1a237e' }}>Cài đặt</Typography>
        </MenuItem>
        {isAdminOrLeader() && (
          <MenuItem onClick={handleAdminDashboard} sx={{ py: 2, borderRadius: 2, mb: 1, '&:hover': { bgcolor: '#e3f0ff' } }}>
            <ListItemIcon>
              <DashboardIcon fontSize="medium" sx={{ color: '#1a237e' }} />
            </ListItemIcon>
            <Typography sx={{ fontWeight: 500, color: '#1a237e' }}>Bảng điều khiển</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout} sx={{ py: 2, borderRadius: 2, mt: 1, color: 'error.main', fontWeight: 700, '&:hover': { bgcolor: '#ffeaea' } }}>
          <ListItemIcon>
            <Logout fontSize="medium" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <Typography sx={{ fontWeight: 700, color: 'error.main' }}>Đăng xuất</Typography>
        </MenuItem>
      </Menu>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 5,
            p: 0,
            background: 'linear-gradient(135deg, #1a237e 0%, #e3f0ff 100%)',
            boxShadow: 12,
            minHeight: { xs: 0, md: 420 },
          }
        }}
      >
        <Box display={{ xs: 'block', md: 'flex' }}>
          {/* Left: Avatar + Quote */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              background: 'linear-gradient(135deg, #1a237e 60%, #283593 100%)',
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: { md: 20, xs: 0 },
              py: 5,
              px: 3,
              color: '#fff',
              minWidth: { md: 320, xs: '100%' },
            }}
          >
            <Box position="relative" mb={2}>
              <label htmlFor="avatar-upload">
                <input
                  accept="image/jpeg, image/png"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <Avatar
                  src={selectedImage || avatar}
                  sx={{
                    width: 130,
                    height: 130,
                    boxShadow: 6,
                    transition: 'transform 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.07)',
                      boxShadow: 12,
                      borderColor: '#ff4081',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: '#fff',
                    borderRadius: '50%',
                    p: 0.5,
                    boxShadow: 2,
                    border: '2px solid #1a237e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UploadFileIcon sx={{ color: '#1a237e', fontSize: 22 }} />
                </Box>
              </label>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1, mb: 1 }}>{name}</Typography>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <FavoriteIcon sx={{ color: '#ff4081', mr: 1 }} />
              <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                "Lan tỏa yêu thương – Kết nối cộng đồng"
              </Typography>
            </Box>
          </Box>
          {/* Right: Form */}
          <Box flex={2} display="flex" alignItems="center" justifyContent="center" sx={{ py: 4, px: { xs: 2, md: 6 }, background: '#fff', borderTopRightRadius: 20, borderBottomRightRadius: { md: 20, xs: 0 } }}>
            <Card elevation={0} sx={{ width: '100%', maxWidth: 420, boxShadow: 0, background: 'transparent' }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  Thông tin cá nhân
                </Typography>
                <TextField
                  margin="dense"
                  label="Họ và tên"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  disabled={isUpdating}
                  InputProps={{
                    startAdornment: (
                      <ListItemIcon><PersonIcon sx={{ color: '#1a237e' }} /></ListItemIcon>
                    ),
                    sx: { borderRadius: 3, background: '#f5fafd' }
                  }}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 1 }}
                />
                <TextField
                  margin="dense"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <ListItemIcon><EmailIcon sx={{ color: '#1a237e' }} /></ListItemIcon>
                    ),
                    sx: { borderRadius: 3, background: '#f5fafd' }
                  }}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 1 }}
                />
                <TextField
                  margin="dense"
                  label="Số điện thoại"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isUpdating}
                  InputProps={{
                    startAdornment: (
                      <ListItemIcon><PhoneIcon sx={{ color: '#1a237e' }} /></ListItemIcon>
                    ),
                    sx: { borderRadius: 3, background: '#f5fafd' }
                  }}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 1 }}
                />
                <TextField
                  margin="dense"
                  label="Mật khẩu mới"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isUpdating}
                  InputProps={{
                    startAdornment: (
                      <ListItemIcon><LockIcon sx={{ color: '#1a237e' }} /></ListItemIcon>
                    ),
                    sx: { borderRadius: 3, background: '#f5fafd' }
                  }}
                  sx={{ mb: 2, borderRadius: 3, boxShadow: 1 }}
                />
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" gap={2} mt={3}>
                  <Button 
                    onClick={handleDialogClose} 
                    color="inherit" 
                    variant="outlined" 
                    disabled={isUpdating}
                    sx={{ 
                      minWidth: 120, 
                      fontWeight: 600, 
                      borderRadius: 3, 
                      color: '#1a237e', 
                      borderColor: '#1a237e', 
                      '&:hover': { background: '#e3f0ff', borderColor: '#1a237e' },
                      '&:disabled': { opacity: 0.6 }
                    }}
                  >
                    Thoát
                  </Button>
                  <Button 
                    onClick={handleUpdate} 
                    variant="contained" 
                    disabled={isUpdating}
                    sx={{ 
                      minWidth: 120, 
                      fontWeight: 600, 
                      borderRadius: 3, 
                      boxShadow: 2, 
                      background: updateSuccess 
                        ? 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)' 
                        : 'linear-gradient(90deg, #1a237e 60%, #283593 100%)', 
                      color: '#fff', 
                      '&:hover': { 
                        background: updateSuccess 
                          ? 'linear-gradient(90deg, #45a049 60%, #4caf50 100%)' 
                          : 'linear-gradient(90deg, #283593 60%, #1a237e 100%)' 
                      },
                      '&:disabled': { opacity: 0.8 },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isUpdating ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : updateSuccess ? (
                      <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                    ) : null}
                    {isUpdating ? 'Đang lưu...' : updateSuccess ? 'Thành công!' : 'Lưu'}
                  </Button>
                </Box>
                <Box mt={4} display="flex" justifyContent="center">
                  <Button onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 700, borderRadius: 3, px: 4, py: 1.2, fontSize: 16, boxShadow: 2, background: '#fff0f0', '&:hover': { background: '#ffeaea', transform: 'scale(1.04)' }, mt: 2 }}>
                    <Logout sx={{ mr: 1, color: 'error.main', fontSize: 22 }} /> Đăng xuất
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Dialog>
      {/* Dialog xác nhận đăng xuất chuyên nghiệp */}
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel} PaperProps={{
        sx: { borderRadius: 4, p: 2, minWidth: 340, textAlign: 'center' }
      }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={2}>
          <WarningAmberRoundedIcon sx={{ fontSize: 60, color: 'error.main', mb: 1 }} />
          <DialogTitle sx={{ color: '#1a237e', fontWeight: 700, fontSize: 24, mb: 1, textAlign: 'center', p: 0 }}>Đăng xuất?</DialogTitle>
          <DialogContent sx={{ fontSize: 17, color: '#333', mb: 2, p: 0 }}>
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, width: '100%' }}>
            <Button onClick={handleLogoutCancel} color="inherit" variant="outlined" sx={{ minWidth: 110, borderRadius: 3, color: '#1a237e', borderColor: '#1a237e', fontWeight: 600, '&:hover': { background: '#e3f0ff', borderColor: '#1a237e' } }}>Hủy</Button>
            <Button onClick={handleLogoutConfirm} color="error" variant="contained" sx={{ minWidth: 110, borderRadius: 3, fontWeight: 700, boxShadow: 2, background: 'linear-gradient(90deg, #e53935 60%, #ff7043 100%)', color: '#fff', '&:hover': { background: 'linear-gradient(90deg, #ff7043 60%, #e53935 100%)' } }}>Đăng xuất</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Profiles;