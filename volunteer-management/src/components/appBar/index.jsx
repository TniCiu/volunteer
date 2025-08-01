import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  InputBase,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../components/appBar/auth/AuthContext';
import Profiles from "./menus/profile";
const PRIMARY_BLUE = "#1a237e";
const PRIMARY_YELLOW = "#ffd700 ";

const CustomAppBar = ({
  title = "Tình Nguyện Viên",
  slogan = "Lan tỏa yêu thương – Kết nối cộng đồng",
  onActivityClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
 const { isAuthenticated } = useAuth();
  return (
    <AppBar
      position="sticky"
      sx={{
        background: PRIMARY_BLUE,
        boxShadow: 2,
        px: { xs: 2, md: 6 },
        py: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 120 }}>
        {/* Nút logo + tên tổ chức */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={() => navigate("/")}
            sx={{
              textAlign: "left",
              color: "#fff",
              p: 0,
              textTransform: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              "&:hover": {
                backgroundColor: "transparent",
                opacity: 0.9,
              },
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: "bold",
                lineHeight: 1.2,
                letterSpacing: 1,
                color: "#fff",
              }}
            >
              {title}
            </Typography>
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.2, color: "#e3f0ff", fontSize: 14 }}
              >
                {slogan}
              </Typography>
            )}
          </Button>
        </Box>

        {/* Thanh chức năng bên phải */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, md: 3 },
            ml: 2,
          }}
        >
          {!isMobile && (
            <>
              <Button href="/" color="inherit" sx={{ fontWeight: 500 }}>
                Trang chủ
              </Button>
              <Button
                color="inherit"
                sx={{ fontWeight: 500 }}
                onClick={onActivityClick || (() => navigate("/hoat-dong"))}
              >
                Hoạt động
              </Button>
            </>
          )}

          {/* Thanh tìm kiếm */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 2,
              px: 1,
              mr: { xs: 0, md: 2 },
              minWidth: isMobile ? 90 : 160,
            }}
          >
            <InputBase
              placeholder="Tìm kiếm"
              sx={{
                ml: 1,
                flex: 1,
                color: PRIMARY_BLUE,
                fontSize: 15,
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton size="small" sx={{ color: PRIMARY_BLUE }}>
              <SearchIcon />
            </IconButton>
          </Box>
 {isAuthenticated ? (
            <Profiles />
          ) : (
           <Button
            variant="contained"
            sx={{
              background: PRIMARY_YELLOW,
              color: PRIMARY_BLUE,
              fontWeight: "bold",
              borderRadius: 5,
              px: 3,
              py: 1,
              fontSize: 15,
              boxShadow: 1,
              "&:hover": { background: "#fff27a" },
              ml: { xs: 0, md: 1 },
            }}
            onClick={() => navigate("/dang-nhap")}
          >
            Đăng nhập
          </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
