import React, { useState } from "react";
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
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/appBar/auth/AuthContext";
import Profiles from "./menus/profile";

const PRIMARY_BLUE = "#1a237e";
const PRIMARY_YELLOW = "#ffd700";

const CustomAppBar = ({
  title = "Tình Nguyện Viên",
  slogan = "Lan tỏa yêu thương – Kết nối cộng đồng",
  onActivityClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [openDrawer, setOpenDrawer] = useState(false);

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Hoạt động", path: "/hoat-dong" },
  ];

  return (
    <>
      {/* APP BAR */}
      <AppBar
        position="sticky"
        sx={{
          background: PRIMARY_BLUE,
          px: { xs: 2, md: 6 },
          py: 1,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: { xs: 70, md: 100 },
          }}
        >
          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setOpenDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: isMobile ? 16 : 20,
                }}
              >
                {title}
              </Typography>

              {!isMobile && (
                <Typography
                  sx={{ color: "#e3f0ff", fontSize: 13 }}
                >
                  {slogan}
                </Typography>
              )}
            </Box>
          </Box>

          {/* RIGHT */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* MENU DESKTOP */}
            {!isMobile && (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/")}
                >
                  Trang chủ
                </Button>
                <Button
                  color="inherit"
                  onClick={
                    onActivityClick ||
                    (() => navigate("/hoat-dong"))
                  }
                >
                  Hoạt động
                </Button>
              </>
            )}

            {/* SEARCH */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: 20,
                px: 1,
                width: isMobile ? "100px" : "200px",
                transition: "0.3s",
                "&:focus-within": {
                  width: isMobile ? "140px" : "260px",
                },
              }}
            >
              <InputBase
                placeholder="Tìm..."
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: isMobile ? 13 : 15,
                }}
              />
              <SearchIcon
                sx={{ color: PRIMARY_BLUE }}
                fontSize="small"
              />
            </Box>

            {/* AUTH */}
            {isAuthenticated ? (
              <Profiles />
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate("/dang-nhap")}
                sx={{
                  background: PRIMARY_YELLOW,
                  color: PRIMARY_BLUE,
                  borderRadius: 20,
                  px: isMobile ? 1.5 : 3,
                  py: isMobile ? 0.5 : 1,
                  fontSize: isMobile ? 12 : 14,
                  fontWeight: "bold",
                  "&:hover": {
                    background: "#fff27a",
                  },
                }}
              >
                {isMobile ? "Đăng nhập" : "Đăng nhập"}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER MOBILE */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setOpenDrawer(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default CustomAppBar;
