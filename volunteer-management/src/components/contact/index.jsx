import React, { useState } from 'react';
import {
    Box,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    IconButton,
    Slide,
    Stack,
    Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PhoneIcon from '@mui/icons-material/Phone';
import { keyframes } from '@mui/system';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialForm = {
    name: '',
    email: '',
    phone: '',
    message: '',
};

const initialErrors = {
    name: '',
    email: '',
    message: '',
};

const HOTLINE = '0123 456 789';

// Shake animation keyframes
const shake = keyframes`
  0% { transform: translate(0, 0); }
  15% { transform: translate(-2px, 2px) rotate(-2deg); }
  30% { transform: translate(2px, -2px) rotate(2deg); }
  45% { transform: translate(-2px, 2px) rotate(-2deg); }
  60% { transform: translate(2px, -1px) rotate(1deg); }
  75% { transform: translate(-1px, 2px) rotate(-1deg); }
  100% { transform: translate(0, 0); }
`;

const Contact = () => {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState(initialErrors);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openPhone, setOpenPhone] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setForm(initialForm);
        setErrors(initialErrors);
        setSuccess(false);
    };

    const validate = () => {
        let valid = true;
        let newErrors = { ...initialErrors };
        if (!form.name.trim()) {
            newErrors.name = 'Vui lòng nhập họ tên.';
            valid = false;
        }
        if (!form.email.trim()) {
            newErrors.email = 'Vui lòng nhập email.';
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Email không hợp lệ.';
            valid = false;
        }
        if (!form.message.trim()) {
            newErrors.message = 'Vui lòng nhập nội dung.';
            valid = false;
        }
        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        // Simulate sending email (replace with real API or EmailJS in production)
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setForm(initialForm);
        }, 1200);
    };

    return (
        <>
            {/* Floating Email Button */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: { xs: 24, md: 32 },
                    right: { xs: 24, md: 32 },
                    zIndex: 1300,
                }}
            >
                <Fab
                    color="primary"
                    aria-label="Liên hệ"
                    onClick={handleOpen}
                    sx={{
                        boxShadow: 4,
                        background: 'linear-gradient(135deg, #1a237e 60%, #4caf50 100%)',
                        color: '#fff',
                        '&:hover': { background: 'linear-gradient(135deg, #4caf50 60%, #1976d2 100%)' },
                        animation: `${shake} 1.2s cubic-bezier(.36,.07,.19,.97) infinite both`,
                        animationDelay: '0.5s',
                    }}
                >
                    <EmailIcon fontSize="large" />
                </Fab>
            </Box>

            {/* Floating Phone Button */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: { xs: 24, md: 32 },
                    left: { xs: 24, md: 32 },
                    zIndex: 1300,
                }}
            >
                <Fab
                    color="success"
                    aria-label="Gọi điện"
                    onClick={() => setOpenPhone(true)}
                    sx={{
                        boxShadow: 4,
                        background: '#4caf50',
                        color: '#fff',
                        '&:hover': { background: '#388e3c' },
                        animation: `${shake} 1.2s cubic-bezier(.36,.07,.19,.97) infinite both`,
                        animationDelay: '1.2s',
                    }}
                >
                    <PhoneIcon fontSize="large" />
                </Fab>
            </Box>

            {/* Phone Dialog */}
            <Dialog
                open={openPhone}
                onClose={() => setOpenPhone(false)}
                TransitionComponent={Transition}
                keepMounted
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 2,
                        background: '#fff',
                        boxShadow: 8,
                        minWidth: 320,
                    },
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between" px={1.5} pt={1} pb={0}>
                    <Typography variant="h6" fontWeight={700}>
                        Hotline tư vấn
                    </Typography>
                    <IconButton onClick={() => setOpenPhone(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ pt: 1 }}>
                    <Typography variant="body1" fontWeight={600} color="#1a237e" mb={2}>
                        {HOTLINE}
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        href={`tel:${HOTLINE.replace(/\s/g, '')}`}
                        sx={{
                            fontWeight: 600,
                            backgroundColor: '#1a237e',
                            color: '#fff',
                            '&:hover': { backgroundColor: '#0f174e' },
                        }}
                        startIcon={<PhoneIcon />}
                    >
                        Gọi ngay
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Contact Form Dialog */}
           <Dialog
  open={open}
  onClose={handleClose}
  TransitionComponent={Transition}
  keepMounted
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: 4,
      p: 1,
      background: '#fff',
      boxShadow: 8,
    },
  }}
>
  <Box display="flex" alignItems="center" justifyContent="space-between" px={2} pt={2} pb={0}>
    <Box display="flex" alignItems="center" gap={1}>
      <VolunteerActivismIcon color="primary" />
      <Typography variant="h6" fontWeight={700}>
        Gửi liên hệ cho chúng tôi
      </Typography>
    </Box>
    <IconButton onClick={handleClose} size="small">
      <CloseIcon />
    </IconButton>
  </Box>
  <DialogContent sx={{ pt: 1 }}>
    <Typography variant="body2" color="text.secondary" mb={2}>
      Bạn có ý tưởng, thắc mắc hoặc muốn đồng hành? Hãy để lại thông tin, chúng tôi sẽ phản hồi sớm nhất!
    </Typography>
    {success ? (
      <Alert severity="success" sx={{ mb: 2 }}>
        Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi qua email sớm nhất có thể.
      </Alert>
    ) : (
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Họ tên"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            size="small"
            required
            type="email"
          />
          <TextField
            label="Số điện thoại (tuỳ chọn)"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            size="small"
            type="tel"
          />
          <TextField
            label="Nội dung liên hệ"
            name="message"
            value={form.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
            fullWidth
            size="small"
            required
            multiline
            minRows={3}
            maxRows={6}
          />
        </Stack>
        <DialogActions sx={{ mt: 2, px: 0 }}>
          <Button onClick={handleClose} color="inherit" variant="text">
            Huỷ
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              fontWeight: 600,
              px: 3,
              backgroundColor: "#1a237e",
              color: "#fff",
              '&:hover': {
                backgroundColor: "#0f174e",
              },
            }}
          >
            {submitting ? "Đang gửi..." : "Gửi liên hệ"}
          </Button>
        </DialogActions>
      </Box>
    )}
  </DialogContent>
</Dialog>
        </>
    );
};

export default Contact;
