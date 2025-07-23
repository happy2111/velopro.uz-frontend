import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '../index.css';

// import required modules
import { Autoplay ,Mousewheel, Pagination } from 'swiper/modules';

export default function HeroSwiper() {
  return (
    <>
      <Swiper
        direction={'vertical'}
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        // spaceBetween={30}
        mousewheel={true}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Mousewheel,Pagination]}
        className="mySwiper"
      >
        <SwiperSlide><img src={"https://www.cyclesolutions.co.uk/images/97620-0104.jpg?width=1920&format=webp"}/></SwiperSlide>
        <SwiperSlide><img src={"https://specialized.com.tw/cdn/shop/collections/plp-banner_epic_2000x.progressive.jpg?v=1744624058"}/></SwiperSlide>
        <SwiperSlide><img src={"https://i.shgcdn.com/bbc9bbaa-bbf8-49db-9d9d-80ebbbb8d284/-/format/auto/-/preview/3000x3000/-/quality/lighter/"}/></SwiperSlide>
      </Swiper>
    </>
  );
}
