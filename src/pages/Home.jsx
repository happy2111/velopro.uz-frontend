// 📁 src/pages/Home.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from "../components/Button.jsx";
import HeroSwiper from "../components/HeroSwiper.jsx";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef();
  const featuresRef = useRef();
  const categoryRef = useRef();

  useEffect(() => {
    // Hero анимация
    const tl = gsap.timeline();

    tl.fromTo('.hero-title',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
      .fromTo('.hero-subtitle',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('.hero-buttons',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.hero-bike',
        { scale: 0.8, opacity: 0, rotationY: -20 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.8'
      );

    // Анимация при скролле для секций
    gsap.fromTo('.feature-card',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
        }
      }
    );

    gsap.fromTo('.category-item',
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: categoryRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
        }
      }
    );

    // Parallax эффект для hero секции
    gsap.to('.hero-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: '🏆',
      title: 'Премиум качество',
      description: 'Только проверенные бренды и оригинальные запчасти'
    },
    {
      icon: '🚚',
      title: 'Быстрая доставка',
      description: 'Доставка по Ташкенту в день заказа'
    },
    {
      icon: '🔧',
      title: 'Сервис и ремонт',
      description: 'Профессиональное обслуживание велосипедов'
    },
    {
      icon: '💰',
      title: 'Выгодные цены',
      description: 'Конкурентные цены и регулярные акции'
    }
  ];

  const categories = [
    {
      name: 'Горные велосипеды',
      image: '/api/placeholder/300/200',
      count: '150+ моделей'
    },
    {
      name: 'Шоссейные',
      image: '/api/placeholder/300/200',
      count: '80+ моделей'
    },
    {
      name: 'Городские',
      image: '/api/placeholder/300/200',
      count: '120+ моделей'
    },
    {
      name: 'Электровелосипеды',
      image: '/api/placeholder/300/200',
      count: '45+ моделей'
    }
  ];

  return (
    <div className="min-h-screen">

      <div ref={heroRef} className="w-full md:pt-14 p-7 max-md:px-4">
          <div className="container p-0 border-collapse overflow-hidden border-dashed border-2 border-dark-15 rounded-4xl">
            <div className="grid">
              {/* top Content - Image Section */}
              <div className="relative">
                <div className="heroSwiper bg-dark-12 rounded-2xl overflow-hidden aspect-[1/1]  min-h-[250px] h-[40vh] w-full relative">
                  <HeroSwiper />
                </div>
              </div>
              {/* bottom Content */}
              <div className="md:pl-8 flex max-md:flex-col relative ">
                <div className="absolute bg-dark-06 p-4 rounded-2xl z-20 -top-8 left-1/2 transform -translate-x-1/2">
                  <Button
                    text="Shop Now"
                    isTransparent={false}
                    border={true}
                    icon={true}
                    className="flex items-center space-x-2"
                    href="/products"
                  />
                </div>


                {/* Navigation Pills */}
                <div className={"max-md:pl-8 md:w-1/2"}>
                  <div className="flex space-x-2 my-6  max-md:mt-16">
                    <Button
                      text="All"
                      isTransparent={true}
                      border={true}
                    />
                    <Button
                      text="All"
                      isTransparent={true}
                      border={true}
                    /> <Button
                    text="All"
                    isTransparent={true}
                    border={true}
                  /> <Button
                    text="All"
                    isTransparent={true}
                    border={true}
                  />
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-4xl lg:text-6xl font-semibold text-white font-roboto leading-tight">
                    Elevate Your Style with StyleLoom
                  </h1>

                  {/* Description */}
                  <p className="text-gray-40 text-base leading-0 max-w-md leading-relaxed mb-6">
                    Explore a world of fashion at StyleLoom, where trends meet affordability. Immerse yourself in the latest styles and seize exclusive promotions.
                  </p>

                </div>
                {/* Stats Grid */}
                <div className="md:w-1/2 grid grid-cols-2  !border-collapse  !min-h-70 ">
                  <div className={"border-dashed border-l-2  border-dark-15 flex items-center justify-center flex-col"}>
                    <div className="text-4xl font-bold text-white mb-2">1,500 +</div>
                    <div className="text-gray-400 text-sm">Fashion Products</div>
                  </div>
                  <div className={"border-dashed border-2 border-t-0 border-r-0 border-collapse border-dark-15 flex items-center justify-center flex-col"}>
                    <div className="text-4xl font-bold text-white mb-2">50 +</div>
                    <div className="text-gray-400 text-sm">New arrivals every month</div>
                  </div>
                  <div className={"border-dashed border-2 border-b-0 border-dark-15 flex items-center justify-center flex-col"}>
                    <div className="text-4xl font-bold text-white mb-2">30%</div>
                    <div className="text-gray-400 text-sm">OFF on select items</div>
                  </div>
                  <div className={"border-dashed border-dark-15 flex items-center justify-center flex-col"}>
                    <div className="text-4xl font-bold text-white mb-2">95%</div>
                    <div className="text-gray-400 text-sm">Customer Satisfaction Rate</div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
    </div>
  );
};

export default Home;