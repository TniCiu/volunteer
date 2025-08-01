import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh, Error } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: '#f8f9fa'
          }}
        >
          <Error sx={{ fontSize: 80, color: '#dc3545', mb: 3 }} />
          
          <Typography variant="h4" color="error" gutterBottom>
            Đã xảy ra lỗi
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 500 }}>
            Có lỗi xảy ra trong ứng dụng. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
          </Typography>

          <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
            <Typography variant="body2" fontWeight="bold">
              Chi tiết lỗi:
            </Typography>
            <Typography variant="caption" component="pre" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReset}
              sx={{ bgcolor: '#007bff' }}
            >
              Thử lại
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Tải lại trang
            </Button>
          </Box>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, maxWidth: 800, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Stack Trace (Development Only):
              </Typography>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 