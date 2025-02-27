"use client";

import { updateAdvertisementClicks } from "@/lib/firestore/advertisement/write";
import { useRouter } from "next/navigation";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function LgAdvertisements({ advertisements }) {
  const router = useRouter();

  const handleAdClick = async (ad) => {
    try {
      await updateAdvertisementClicks(ad.id);
      if (ad.link) {
        router.push(ad.link);
      } else {
        console.log("Link not available");
      }
    } catch (error) {
      console.log({ error });
      console.log("Unable to update click count");
    }
  };

  return (
    <section className="w-full">
      <div className="w-full max-w-full lg:max-w-[1500px] mx-auto p-5">
        <Swiper
          slidesPerView={1} // Display one slide at a time
          loop={true} // Enable infinite loop
          watchOverflow={true} // Prevent issues if the number of slides is less than can be shown
          centeredSlides={true} // Center slides for better appearance
        >
          {advertisements.map((ad) => (
            <SwiperSlide key={ad.id}>
              <div className="w-full p-2 h-full flex justify-center">
                <img
                  onClick={() => handleAdClick(ad)}
                  src={ad.addImage}
                  alt={`Ad ${ad.id}`}
                  className="w-full h-auto object-cover cursor-pointer"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}