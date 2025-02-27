"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Photos({ imageList }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [offset, setOffset] = useState({ left: 0, top: 0 });
  const sourceRef = useRef(null);
  const targetRef = useRef(null);
  const containerRef = useRef(null);

  if (imageList?.length === 0) {
    return <></>;
  }

  const previousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const handleMouseMove = (e) => {
    const targetRect = targetRef.current.getBoundingClientRect();
    const sourceRect = sourceRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const xRatio = (targetRect.width - containerRect.width) / sourceRect.width;
    const yRatio =
      (targetRect.height - containerRect.height) / sourceRect.height;
    const left = Math.max(
      Math.min(e.clientX - sourceRect.left, sourceRect.width),
      0
    );
    const top = Math.max(
      Math.min(e.clientY - sourceRect.top, sourceRect.height),
      0
    );
    setOffset({
      left: left * -xRatio,
      top: top * -yRatio,
    });
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-center w-full relative items-center">
        <button
          onClick={previousImage}
          className="absolute top-1/2 left-[20px] transform -translate-y-1/2 z-10"
        >
          <ChevronLeft />
        </button>
        <div
          className="flex justify-center w-full relative items-center overflow-hidden"
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <img
            ref={sourceRef}
            className="object-cover h-[350px] md:h-[430px]"
            src={imageList[selectedImageIndex]}
            alt=""
          />
          <img
            ref={targetRef}
            className="absolute inset-0 w-auto h-auto max-w-none max-h-none transition-opacity duration-300 ease-in-out bg-white"
            style={{
              opacity: opacity,
              left: `${offset.left}px`,
              top: `${offset.top}px`,
              width: "200%",
              height: "200%",
            }}
            src={imageList[selectedImageIndex]}
            alt=""
          />
        </div>
        <button
          onClick={nextImage}
          className="absolute top-1/2 right-[20px] transform -translate-y-1/2 z-10"
        >
          <ChevronRight />
        </button>
      </div>
      <Swiper
  spaceBetween={10}
  slidesPerView={"auto"}
  freeMode
  watchSlidesProgress
  className="thumbnailSwiper"
>
  {imageList.map((item, index) => (
    <SwiperSlide
      key={index}
      onClick={() => setSelectedImageIndex(index)}
      className={`w-auto border rounded p-2 cursor-pointer ${
        index === selectedImageIndex ? "border-black" : ""
      }`}
    >
      <img className="object-cover w-[80px] h-full" src={item} alt="" />
    </SwiperSlide>
  ))}
</Swiper>
    </div>
  );
}
