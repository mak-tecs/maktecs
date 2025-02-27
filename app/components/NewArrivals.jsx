"use client";

import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Only import Navigation since no dots are wanted
import "swiper/css";
import "swiper/css/navigation";
import { ProductCard } from "./Products"; // Assume ProductCard is correctly imported

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function NewArrivals({ products }) {
  return (
    <section className="w-full flex flex-col relative justify-center py-16 my-7 bg-[#def9f2] overflow-hidden">
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] aspect-square rounded-full bg-[#cce7e0]"></div>
      <motion.h1
        className="text-center mb-5 text-4xl uppercase"
        variants={headingVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
      >
        New Arrivals
      </motion.h1>

      <div className="max-w-full p-5 px-10 flex justify-center items-center">
        <Swiper
          slidesPerView="auto"
          spaceBetween={30}
          loop={true}
        >
          {products?.map((item) => (
            <SwiperSlide
              key={item?.id}
              style={{ width: "auto", height: "auto" }}
            >
              <ProductCard
                fromSlider={true}
                product={item}
                className={"w-[200px] sm:w-[300px] h-full"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
