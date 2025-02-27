"use client";

import { updateAdvertisementClicks } from "@/lib/firestore/advertisement/write";
import { useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SmAdvertisements({ advertisements }) {
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
    <section className="w-full flex justify-center">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          className="advertisement-swiper"
          loop={true}
          centeredSlides={false}
          watchOverflow={true}
        >
          {advertisements.map((ad) => (
            <SwiperSlide key={ad.id} style={{ width: "auto", height: "auto"}}>
              <div className="flex justify-center p-2">
                <img
                  onClick={() => handleAdClick(ad)}
                  src={ad.addImage}
                  alt={`Ad ${ad.id}`}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
    </section>
  );
}