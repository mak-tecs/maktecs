"use client";

import { useRef, useState, useEffect } from "react";

export default function ImageGallery({ images, aspectRatio = 16 / 9 }) {
  const [expanded, setExpanded] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(0);
  const galleryRef = useRef(null);

  function calculateImageHeight(imageUrl, screenWidth, callback) {
    const img = new Image(); // Create a new Image object
    img.src = imageUrl;

    img.onload = function () {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      const calculatedHeight = (originalHeight / originalWidth) * screenWidth;

      callback(calculatedHeight);
    };

    img.onerror = function () {
      console.error("Failed to load image:", imageUrl);
    };
  }

  const calculateHeight = (images) => {
    const screenWidth = window.innerWidth; // Get current screen width

    images.forEach((imageUrl) => {
      calculateImageHeight(imageUrl, screenWidth, (h) => {
        console.log(`Image Height: ${h.toFixed(2)}px`);
        setGalleryHeight(height => (height + h));
      });
    });
  };

  // Recalculate height on window resize
  useEffect(() => {
    calculateHeight(images);
    window.addEventListener("resize", () => calculateHeight(images));
    return () =>
      window.removeEventListener("resize", () => calculateHeight(images));
  }, [images]);

  const toggleExpanded = () => {
    if (expanded) {
      galleryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setExpanded(!expanded);
  };

  return (
    <div className={`relative w-full ${expanded ? "mb-24" : "mb-4"}`}>
      {/* Image container with smooth height transition */}
      <div
        ref={galleryRef}
        className={`overflow-hidden transition-all ease-in-out ${
          expanded ? `max-h-[${galleryHeight}px]` : "max-h-[50vh]"
        }`}
        style={{
          maxHeight: expanded ? galleryHeight + "px" : "380px",
          transitionDuration: images.length + 1000 + "ms",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className="w-full object-cover"
          />
        ))}
      </div>

      {/* Fade effect when not expanded */}
      {!expanded && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent"></div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleExpanded}
        className={`absolute transition-all duration-500 left-1/2 -translate-x-1/2 bg-gray-900 text-white py-4 px-6 rounded z-30`}
        style={{
          bottom: expanded ? "-5rem" : "40%",
          transitionDuration: expanded ? images.length + 700 + "ms" : "0ms",
        }}
      >
        {expanded ? "Close" : "View All"}
      </button>
    </div>
  );
}
