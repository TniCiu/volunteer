import React, { useState } from "react";
import { Button, TextField, Typography, Box, Divider, useMediaQuery } from "@mui/material";
import { SignUpAPI } from "../../../../apis"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Footer from "../../../footer";
import CustomAppBar from "../..";
import { useAuth } from '../../auth/AuthContext';
const SignUp = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword || !phone) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await SignUpAPI({ email, password, name, phone });
      localStorage.setItem("token", res.token);
      localStorage.setItem("id", res.user.id);
      console.log(res);
      login();
      toast.success(res?.message);
      navigate('/');
    } catch (error) {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <>
      <CustomAppBar />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: { xs: "column", md: "row" },
          backgroundColor: "#f5f5f5",
          pt: { xs: 8, md: 0.1 }
        }}
      >
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              maxWidth: "40%",
              position: "relative",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <video
              autoPlay
              muted
              loop
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source
                src="https://res.cloudinary.com/ddmsl3meg/video/upload/v1734022899/tnelcibodjsy5ej8hzoo.mp4"
                type="video/mp4"
              />
            </video>
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "60%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: "20px", md: "40px" },
            backgroundColor: "white",
            boxShadow: { md: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              padding: { xs: "20px", md: "40px" },
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h5"
              color="#1a237e"
              fontWeight="bold"
              mb={3}
              textAlign="center"
            >
              Đăng Ký Tài Khoản
            </Typography>
            {error && (
              <Typography
                color="red"
                textAlign="center"
                sx={{ marginBottom: 2 }}
              >
                {error}
              </Typography>
            )}
            {success && (
              <Typography
                color="green"
                textAlign="center"
                sx={{ marginBottom: 2 }}
              >
                Account created successfully!
              </Typography>
            )}

            <TextField
              name="name"
              label="Họ và Tên"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              sx={{ marginBottom: 3 }}
            />
            <TextField
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              sx={{ marginBottom: 3 }}
            />
            <TextField
              name="email"
              label="Địa chỉ Email"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ marginBottom: 3 }}
            />
            <TextField
              name="password"
              label="Mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ marginBottom: 3 }}
            />
            <TextField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />

            {/* Button Sign Up */}
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#1a237e",
                color: "white",
                fontWeight: "bold",
                padding: "10px",
                borderRadius: "20px",
                marginBottom: 3,
                "&:hover": { backgroundColor: "#1976d3" },
              }}
            >
              Đăng Ký
            </Button>

            <Divider sx={{ marginY: 2, width: "100%" }} />

            {/* Chuyển sang trang đăng nhập */}
            <Typography textAlign="center">
              Bạn đã có tài khoản rồi?{" "}
              <Button
                href="/dang-nhap"
                sx={{
                  color: "#1a237e",
                  textTransform: "none",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  padding: 0,
                  minWidth: "auto",
                }}
              >
                Đăng nhập
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default SignUp;
