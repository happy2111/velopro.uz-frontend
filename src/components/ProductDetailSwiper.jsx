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
import Button from "./Button.jsx";

export default function ProductDetailSwiper({images, isAdmin=false}) {
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
        {isAdmin && (
          <SwiperSlide key={"add"}>
            <Button
              text={"+"}
              className={`w-full min-h-full !bg-brown-65 text-[70px] text-white flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-gray-400 ${isAdmin ? '' : 'opacity-50 cursor-not-allowed'}`}
            />
          </SwiperSlide>
        )}


      </Swiper>
    </>
  );
}
