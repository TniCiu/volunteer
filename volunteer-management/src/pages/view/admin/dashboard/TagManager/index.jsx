import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, Button, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Snackbar, CircularProgress, Tooltip, Divider,
  Badge, LinearProgress, Avatar
} from '@mui/material';
import {
  LocalOffer as TagIcon, Search as SearchIcon, Add as AddIcon, Edit as EditIcon,
  Delete as DeleteIcon, Description as DescriptionIcon, 
  TrendingUp as TrendingUpIcon, Schedule as ScheduleIcon, 
  VerifiedUser as VerifiedUserIcon, Star as StarIcon
} from '@mui/icons-material';
import AddTag from './add';
import UpdateTag from './update';
import { 
  getAllTagsAPI, 
  createTagAPI, 
  updateTagAPI, 
  deleteTagAPI
} from '../../../../../apis';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  // Fetch tags from API
  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await getAllTagsAPI();
      
      // Đảm bảo tất cả tags có đầy đủ các trường cần thiết
      const formattedTags = data.map(tag => ({
        id: tag.id,
        name: tag.name || '',
        description: tag.description || '',
        created_at: tag.created_at || new Date().toISOString(),
        updated_at: tag.updated_at || new Date().toISOString()
      }));
      
      setTags(formattedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi tải danh sách loại hoạt động', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại hoạt động này?')) {
      try {
        await deleteTagAPI(id);
        setTags(tags.filter(t => t.id !== id));
        setSnackbar({ open: true, message: 'Xóa loại hoạt động thành công!', severity: 'success' });
      } catch (error) {
        console.error('Error deleting tag:', error);
        setSnackbar({ 
          open: true, 
          message: 'Lỗi khi xóa loại hoạt động', 
          severity: 'error' 
        });
      }
    }
  };

  const handleEdit = (tag) => {
    setSelectedTag(tag);
    setShowUpdateForm(true);
  };

  const handleUpdateTag = async (id, updatedData) => {
    try {
      const response = await updateTagAPI(id, updatedData);
      setTags(tags.map(tag => 
        tag.id === id ? { ...tag, ...response, updated_at: new Date().toISOString() } : tag
      ));
      setSnackbar({ open: true, message: 'Cập nhật loại hoạt động thành công!', severity: 'success' });
      setShowUpdateForm(false);
      setSelectedTag(null);
    } catch (error) {
      console.error('Error updating tag:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi cập nhật loại hoạt động', 
        severity: 'error' 
      });
    }
  };

  const handleCloseUpdate = () => {
    setShowUpdateForm(false);
    setSelectedTag(null);
  };

  const handleAddTag = async (newTagData) => {
    try {
      const response = await createTagAPI(newTagData);
      const newTag = {
        id: response.id,
        name: response.name,
        description: response.description,
        created_at: response.created_at || new Date().toISOString(),
        updated_at: response.updated_at || new Date().toISOString()
      };
      setTags([...tags, newTag]);
      setSnackbar({ open: true, message: 'Thêm loại hoạt động thành công!', severity: 'success' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding tag:', error);
      setSnackbar({ 
        open: true, 
        message: 'Lỗi khi thêm loại hoạt động', 
        severity: 'error' 
      });
    }
  };

  const handleBackToList = () => {
    setShowAddForm(false);
    setShowUpdateForm(false);
    setSelectedTag(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showAddForm) {
    return <AddTag onBack={handleBackToList} onSave={handleAddTag} />;
  }

  if (showUpdateForm && selectedTag) {
    return (
      <UpdateTag 
        tag={selectedTag} 
        onClose={handleCloseUpdate} 
        onUpdate={handleUpdateTag} 
      />
    );
  }

  return (
    <Box sx={{ pb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)', minHeight: '100vh' }}>
      {showAddForm ? (
        <AddTag 
          onBack={handleBackToList}
          onSave={handleAddTag}
        />
      ) : showUpdateForm ? (
        <UpdateTag
          tag={selectedTag}
          onClose={handleCloseUpdate}
          onUpdate={handleUpdateTag}
        />
      ) : (
        <>
          {/* Header with Stats */}
          <Box sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', borderRadius: 3, color: 'white' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight={100} sx={{ mb: 1 }}>
                  Quản lý Loại hoạt động
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Search & Add Section */}
          <Card sx={{ mb: 4, background: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm loại hoạt động theo tên, mô tả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ 
                      startAdornment: <SearchIcon sx={{ color: '#1a237e', mr: 1 }} />,
                      sx: { 
                        borderRadius: 3,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#1a237e',
                        }
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        bgcolor: '#fafafa',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      } 
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="large"
                    onClick={() => setShowAddForm(true)}
                    sx={{
                      bgcolor: '#1a237e',
                      borderRadius: 2,
                      py: 1.2,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: '0 2px 8px rgba(26, 35, 126, 0.2)',
                      '&:hover': { 
                        bgcolor: '#3949ab',
                        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Thêm loại hoạt động
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Table Section */}
          <Card sx={{ background: 'white', borderRadius: 3, boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)' }}>
            <CardContent sx={{ p: 0 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                  <CircularProgress sx={{ color: '#1a237e' }} size={60} />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)' }}>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Loại hoạt động</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Mô tả</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Ngày tạo</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Ngày cập nhật</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTags.map((tag) => (
                        <TableRow key={tag.id} hover sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                sx={{ 
                                  mr: 2, 
                                  width: 50, 
                                  height: 50,
                                  border: '3px solid #e3f2fd',
                                  bgcolor: '#1a237e'
                                }}
                              >
                                <TagIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600} color="#1a237e">
                                  {tag.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {tag.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" sx={{
                              maxWidth: 300,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {tag.description || 'Không có mô tả'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(tag.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(tag.updated_at)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <Tooltip title="Chỉnh sửa thông tin">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEdit(tag)}
                                  sx={{ 
                                    bgcolor: '#e3f2fd', 
                                    color: '#1a237e',
                                    '&:hover': { bgcolor: '#1a237e', color: 'white' }
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa loại hoạt động">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#ffebee', 
                                    color: '#f44336',
                                    '&:hover': { bgcolor: '#f44336', color: 'white' }
                                  }}
                                  onClick={() => handleDelete(tag.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {!loading && filteredTags.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 6 }}>
                  <TagIcon sx={{ fontSize: 80, color: '#1a237e', mb: 2, opacity: 0.5 }} />
                  <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                    Không tìm thấy loại hoạt động nào
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Hãy thử tìm kiếm với từ khóa khác hoặc thêm loại hoạt động mới
                  </Typography>
                </Box>
              )}
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
        </>
      )}
      
      {/* Snackbar for AddTag component */}
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

export default TagManager; 