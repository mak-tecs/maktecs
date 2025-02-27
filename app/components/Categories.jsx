"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Categories({ categories }) {
  const router = useRouter();

  if (categories.length === 0) {
    return <></>;
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col gap-8 justify-center overflow-hidden md:p-10 p-5">
      <div className="flex justify-center w-full">
        <motion.h1
          className="text-center mb-5 text-4xl uppercase"
          variants={headingVariants}
          loop={true}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          All Category
        </motion.h1>
      </div>
      <Swiper
    slidesPerView="auto"
    spaceBetween={30}
    loop={true}
  >
    {categories?.map((category, index) => (
      <SwiperSlide key={index} style={{ width: "auto" }}>
       <motion.div
          className="px-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          variants={itemVariants}
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="md:h-32 md:w-32 h-24 w-24 md:p-5 p-2 overflow-hidden">
              <img
                src={category?.imageURL}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl">{category?.name}</h1>
            <p>
              {category.productCount > 1000
                ? "1k+"
                : category.productCount}{" "}
              products
            </p>
            <button
              onClick={() => router.push(`/categories/${category?.id}`)}
              className="flex-1 border border-gray-700 hover:bg-gray-700 hover:text-white px-2 rounded-lg text-medium"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </SwiperSlide>
    ))}
  </Swiper>
    </div>
  );
}