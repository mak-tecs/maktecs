"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

// Import Swiper styles and required modules
import { Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { motion } from "framer-motion";

export default function FeaturedProductSlider({ featuredProducts }) {
  // Motion variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-hidden">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // Keeps autoplay enabled after manual interaction
          pauseOnMouseEnter: true, // Pauses autoplay on mouse enter
        }}
        loop={true}
        className="mySwiper"
      >
        {featuredProducts?.map((product, index) => (
          <SwiperSlide key={product.id}>
            <div className="flex flex-col-reverse md:flex-row gap-4 bg-[#f8f8f8] p-5 md:px-24 md:py-20 w-full">
              <div className="flex-1 flex flex-col md:gap-10 gap-4">
                <motion.h2
                  className="text-gray-500 text-xs md:text-base"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  FEATURE PRODUCT
                </motion.h2>
                <motion.div
                  className="flex flex-col gap-4"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                >
                  <Link href={`/products/${product?.id}`}>
                    <h1 className="md:text-4xl text-xl font-semibold">
                      {product?.title}
                    </h1>
                  </Link>
                  <h1 className="text-gray-600 md:text-sm text-xs max-w-96 line-clamp-2">
                    {product?.shortDescription}
                  </h1>
                </motion.div>
                <AuthContextProvider>
                  <motion.div
                    className="flex items-center gap-4"
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.6, delay: 0.3 * index }}
                  >
                    <Link
                      href={`/checkout?type=buynow&productId=${product?.id}`}
                    >
                      <button className="flex-1 bg-gray-700 text-white p-4 rounded-lg text-medium w-full">
                        BUY NOW
                      </button>
                    </Link>
                    <AddToCartButton productId={product?.id} type={"large"} />
                    <FavoriteButton productId={product?.id} />
                  </motion.div>
                </AuthContextProvider>
              </div>
              <motion.div
                className=""
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.2 * index }}
              >
                <Link href={`/products/${product?.id}`}>
                  <img
                    className="h-[14rem] md:h-[23rem]"
                    src={product?.featureImageURL}
                    alt=""
                  />
                </Link>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}