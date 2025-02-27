"use client";

import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Import necessary modules
import "swiper/css";
import "swiper/css/navigation";
import { ProductCard } from "./Products"; // Assume ProductCard is correctly imported

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function TopSellers({ products }) {
  return (
    <section className="w-full flex flex-col relative justify-center py-16 my-7 bg-[#fef3dd] overflow-hidden">
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] aspect-square rounded-full bg-[#fae8c4]"></div>

      <motion.h1
        className="text-center mb-5 text-4xl uppercase"
        variants={headingVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        Best Sellers
      </motion.h1>

      <div className="max-w-full  py-5 px-24 ">
        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          loop={true}
          modules={[ Pagination]}
          // navigation
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom', // Specify a custom class for pagination
          }}
        >
          {products?.map((item) => (
            <SwiperSlide key={item?.id} style={{ width: "auto", height:"auto" }}>
              <ProductCard fromSlider={true} product={item} className="w-[200px] sm:w-[300px] h-full" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination-custom mt-8 flex justify-center gap-2"></div> 
      </div>
     
    </section>
  );
}
