import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import '../css/ProductDetailPage.css';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

export default function ProductDetailSwiper({images}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {images && images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`} alt={`Product Image ${index + 1}`} className="w-full h-auto object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="downSwiper"
      >
        {images && images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`} alt={`Product Image ${index + 1}`} className="w-full h-auto object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
