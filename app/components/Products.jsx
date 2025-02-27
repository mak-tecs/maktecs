"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import { Suspense, useEffect, useMemo, useState } from "react";
import MyRating from "./MyRating";
import { useRouter } from "next/navigation";
import SearchBox from "./SearchBox";

// Animation variants for cards and heading
const cardVariants = {
  hidden: { opacity: 0, y: 20 }, // Initial state, off-screen and faded
  visible: { opacity: 1, y: 0 }, // Visible state, on-screen and fully opaque
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductsGridView({
  title,
  toggleDrawer,
  showFiltersBtn = false,
  showSearchBar = true,
  handleSearch,
  products,
}) {
  const router = useRouter();

  //   return (
  //     <div class="flex w-fit">
  //   <div class="p-4 bg-blue-500 text-white">Item 1</div>
  //   <div class="p-4 bg-green-500 text-white">Item 2</div>
  // </div>

  //   )

  return (
    <section className="w-full flex justify-center ">
      <div className="flex flex-col gap-5 max-w-[1500px] p-5">
        {title && (
          <motion.h1
            className="text-center mb-5 text-4xl uppercase"
            variants={headingVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
        )}

        {showSearchBar && (
          <SearchBox
            toggleDrawer={toggleDrawer}
            showFiltersBtn={showFiltersBtn}
            handleSubmit={(query) => {
              if (handleSearch) {
                handleSearch(query);
              } else {
                router.push(`/search?q=${query}`);
                router.refresh();
              }
            }}
          />
        )}

        <div className="flex flex-wrap gap-[18px] justify-center">
          {products?.map?.((item) => (
            <ProductCard
              product={item}
              key={item?.id}
              className={
                "w-[calc(50%-10px)] sm:w-[calc(33%-10px)] md:w-[calc(25%-15px)]"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product, className }) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(product.featureImageURL);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      // whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => {
        if (product.imageList && product.imageList.length > 0) {
          setCurrentImage(product.imageList[0]);
        }
      }}
      onMouseLeave={() => {
        setCurrentImage(product.featureImageURL);
      }}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/products/${product.id}`);
      }}
      className={`flex flex-col gap-3 border overflow-hidden cursor-pointer bg-white rounded-lg ${className}`}
    >
      <div className="relative w-full">
        <motion.img
          src={currentImage}
          className="w-full aspect-square object-cover"
          alt={product?.title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute top-1 right-1">
          <AuthContextProvider>
            <FavoriteButton productId={product?.id} />
          </AuthContextProvider>
        </div>
      </div>
      <div className="flex flex-col justify-between flex-grow h-full gap-3 p-3">
        <div className="flex flex-col gap-3">
          <h1 className="font-semibold line-clamp-2 text-lg">
            {product?.title}
          </h1>
          <div>
            <h2 className="text-green-500 text-sm font-semibold">
              Rs {product?.salePrice}{" "}
              {product?.salePrice < product?.price && (
                <span className="line-through text-xs text-gray-600">
                  Rs {product?.price}
                </span>
              )}
            </h2>
          </div>
          <div className="w-full hidden sm:block">
            <p className="text-xs text-gray-500 line-clamp-2">
              {product?.shortDescription}
            </p>
          </div>
          <Suspense>
            <RatingReview product={product} />
          </Suspense>
        </div>
        <div className="flex flex-col gap-1">
          {product?.stock <= (product?.orders ?? 0) && (
            <div className="flex">
              <h3 className="text-red-500 rounded-lg text-xs font-semibold">
                Out Of Stock
              </h3>
            </div>
          )}
          <div className="flex items-center gap-4 w-full h-[60px]">
            <div className="w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/checkout?type=buynow&productId=${product?.id}`);
                }}
                className="flex-1 bg-gray-700 text-white p-4 rounded-lg text-medium w-full"
              >
                <span className="block sm:hidden">Buy</span>
                <span className="hidden sm:block">Buy Now</span>
              </button>
            </div>
            <AuthContextProvider>
              <AddToCartButton productId={product?.id} />
            </AuthContextProvider>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RatingReview({ product }) {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const fetchReviewCounts = async () => {
      try {
        const data = await getProductReviewCounts({ productId: product?.id });
        setCounts(data);
      } catch (error) {
        console.error("Error fetching product review counts:", error);
      }
    };

    fetchReviewCounts();
  }, [product?.id]);

  return (
    <div className="flex gap-3 items-center">
      {counts && counts.averageRating > 0 ? (
        <>
          <MyRating value={counts.averageRating ?? 0} />
          <h1 className="text-xs text-gray-400">
            <span>{counts.averageRating?.toFixed(1)}</span> (
            {counts.totalReviews})
          </h1>
        </>
      ) : null}
    </div>
  );
}
