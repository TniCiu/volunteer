import React, { useState } from "react";
import { Button, TextField, Typography, Box, Divider, useMediaQuery } from "@mui/material";
import Footer from "../../../footer";
import CustomAppBar from "../..";
import { loginAPI } from "../../../../apis";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/AuthContext';
const Login = () => {
  const { login } = useAuth()
  const isMobile = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await loginAPI({ email, password });
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', res);
      console.log('Token:', res.token);
      console.log('User ID:', res.user?.id);
      console.log('User Role:', res.user?.role);
      
      localStorage.setItem("token", res.token);
      localStorage.setItem("id", res.user.id);
      localStorage.setItem("role", res.user.role);
      
      console.log('=== AFTER SETTING LOCALSTORAGE ===');
      console.log('Stored token:', localStorage.getItem('token'));
      console.log('Stored user ID:', localStorage.getItem('id'));
      console.log('Stored user role:', localStorage.getItem('role'));
      
      // Gọi login() sau khi đã set localStorage
      login();
      
      console.log('=== AFTER CALLING LOGIN() ===');
      console.log('AuthContext should be updated now');
      
      toast.success(res?.message);
      
      // Redirect based on user role
      if (res.user.role === 'admin' || res.user.role === 'leader') {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your credentials.");
      setError("Login failed. Please check your credentials.");
    }
  };


  return (
    <>
    <CustomAppBar />
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        pt:{ xs:8, md: 0.1 },
      }}
    >
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            maxWidth: "50%",
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
           Đăng nhập tài khoản 
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
              Đăng nhập thành công!
            </Typography>
          )}

          <TextField
            name="email"
            label="Điạ chỉ Email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            name="password"
            label="Mât khẩu"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{ marginBottom: 3 }}
          />
          <Typography
            variant="body2"
            textAlign="right"
            color="primary"
            mb={2}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Quên Mật Khẩu?
          </Typography>
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
            Đăng Nhập
          </Button>

          <Divider sx={{ marginY: 2, width: "100%" }} />

          <Typography textAlign="center">
            Bạn chưa có tài khoản?{" "}
            <Button
              href="/dang-ky"
              sx={{
                color: "#1a237e",
                textTransform: "none",
                fontWeight: "bold",
                textDecoration: "underline",
                padding: 0,
                minWidth: "auto",
              }}
            >
              Đăng ký
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
    <Footer/>
    </>
  );
};

export default Login;
