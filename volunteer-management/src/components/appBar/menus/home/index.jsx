import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent
} from "@mui/material";
import CustomAppBar from "../../index";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import Footer from "../../../footer/index.jsx";

const PRIMARY_BLUE = "#1a237e";

const gallerySlides = [
  {
    img: "https://image.bnews.vn/MediaUpload/Org/2022/12/23/ttxvn-trong-cay-1-20221223172606.jpg",
    title: "Trồng cây gây rừng",
    desc: "Chung tay bảo vệ môi trường xanh.",
  },
  {
    img: "https://tse4.mm.bing.net/th/id/OIP.zhm7t9_8fQUXz8VozjE_YAHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    title: "Dạy học cho trẻ em vùng cao",
    desc: "Lan tỏa tri thức, chắp cánh ước mơ.",
  },
  {
    img: "https://www.haui.edu.vn/media/87/t87869.jpg",
    title: "Hiến máu nhân đạo",
    desc: "Một giọt máu cho đi, một cuộc đời ở lại.",
  },
  {
    img: "https://media.lephammedia.com/express24h/uploads/2024/04/Anh-2.jpg",
    title: "Chia sẻ yêu thương",
    desc: "Cùng nhau giúp đỡ những hoàn cảnh khó khăn.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <CustomAppBar
        logo="https://i.imgur.com/2yaf2wb.png"
        title="Tình Nguyện Viên"
        onActivityClick={() => navigate("/hoat-dong")}
      />

      {/* Banner */}
      <Box
        sx={{
          background: "url('https://media.istockphoto.com/id/2177185286/vi/anh/a-team-of-young-volunteers-work-together-to-plant-trees-to-restore-the-environment-with.jpg?s=2048x2048&w=is&k=20&c=4s6ZqRwlea_b3IYgOvtyfvQ2USqkAkY86-x2pKcheuU=')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          mb: 4,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(12, 13, 14, 0.25)",
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: "#fff", mb: 2, letterSpacing: 2 }}
          >
            Tình Nguyện Viên
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "#e3f0ff", mb: 3, fontWeight: 400 }}
          >
            Lan tỏa yêu thương – Kết nối cộng đồng
          </Typography>
          <Button
          href="/hoat-dong"
            variant="contained"
            size="large"
            sx={{
              background: "#ffd700",
              color: "#1a237e",
              fontWeight: "bold",
              borderRadius: 5,
              px: 4,
              fontSize: 18,
              boxShadow: 2,
              "&:hover": { background: "#ffe066" },
            }}
          >
            Tham Gia Ngay
          </Button>
        </Box>
      </Box>

      {/* About Us */}
      <Container sx={{ py: { xs: 4, md: 10 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "flex-start" },
            gap: 4,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              mb={2}
              sx={{ color: "#1a237e", fontSize: { xs: 32, md: 40 } }}
            >
              Về Chúng Tôi
            </Typography>
            <Typography variant="body1" color="#222" mb={2} sx={{ fontSize: 18 }}>
              <b>Tình Nguyện Viên</b> là một tổ chức phi lợi nhuận quy tụ những bạn trẻ giàu lòng nhiệt huyết, mong muốn mang lại những thay đổi tích cực cho cộng đồng và xã hội.
            </Typography>
            <Typography variant="body1" color="#222" sx={{ fontSize: 18 }}>
              Với tinh thần <b>“Hành động vì cộng đồng”</b>, chúng tôi thực hiện nhiều hoạt động ý nghĩa như: <b>hiến máu nhân đạo</b>, <b>bảo vệ môi trường</b>, <b>hỗ trợ người vô gia cư</b>, <b>giúp đỡ trẻ em khó khăn</b>, và nhiều chương trình khác nhằm lan tỏa yêu thương và xây dựng một xã hội nhân ái hơn.
            </Typography>
          </Box>
          <Box
            sx={{
              flexShrink: 0,
              ml: { md: 4 },
              mt: { xs: 4, md: 0 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="https://cand.com.vn/Files/Image/thanhhang/2016/07/04/f240eaee-5bf3-405c-91a0-0cf1ce3aa042.jpg"
              alt="about"
              sx={{
                height: { xs: 300, md: 400 },
                objectFit: "cover",
                borderRadius: 2,
                background: "#fff",
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Gallery Carousel */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: PRIMARY_BLUE,
              fontSize: { xs: 32, md: 40 },
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            Khoảnh Khắc Tình Nguyện
          </Typography>
        </Box>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={40}
          slidesPerView={1}
          breakpoints={{
            600: { slidesPerView: 2 },
          }}
          style={{ paddingBottom: 48 }}
        >
          {gallerySlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <Card
                sx={{
                  borderRadius: 5,
                  boxShadow: 4,
                  maxWidth: 520,
                  mx: "auto",
                  overflow: "hidden",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.03)",
                    boxShadow: 8,
                  },
                  bgcolor: "#fafdff",
                }}
              >
                <Box
                  component="img"
                  src={slide.img}
                  alt={slide.title}
                  sx={{
                    width: "100%",
                    height: { xs: 220, md: 300 },
                    objectFit: "cover",
                    transition: "transform 0.4s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: PRIMARY_BLUE }}>
                    {slide.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: 15, md: 18 } }}>
                    {slide.desc}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      <Box>
        <Footer />
       
      </Box>
    </Box>
  );
};

export default Home;
