import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/ProductPage.css';
import { Pagination } from 'swiper/modules';

const ProductSwiper = ({images}) => {
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {images && images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`} alt={`Product Image ${index + 1}`} className="w-full h-auto object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default ProductSwiper;