"use client";
import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";
import MyRating from "@/app/components/MyRating";
import AuthContextProvider from "@/contexts/AuthContext";
import { getBrand } from "@/lib/firestore/brands/read_server";
import { getCategory } from "@/lib/firestore/categories/read_server";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function Benefits() {
  return (
    <div className="flex flex-col justify-center w-full mt-4">
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/icons/warranty-tech.webp"
          alt="Warranty"
          className="h-12 aspect-square"
        />
        <span>
          <b>Warranty:</b> <br />6 Months
        </span>
      </div>
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/icons/Delivery-tech.webp"
          alt="Delivery"
          className="h-12 aspect-square"
        />
        <span>
          <b>Delivery:</b> <br />4 To 5 Working Days
        </span>
      </div>
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/icons/Availability-tech.webp"
          alt="Availability"
          className="h-12 aspect-square"
        />
        <span>
          <b>Availability:</b> <br />
          In Stock
        </span>
      </div>
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/banners/65b387e6e3ba8.webp"
          alt="Cash on Delivery"
          className="h-12 aspect-square"
        />
        <span>
          <b>Cash on Delivery:</b> <br />
          Cash on Delivery
        </span>
      </div>
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/banners/65b387e6e3fe6.webp"
          alt="Customer Support"
          className="h-12 aspect-square"
        />
        <span>
          <b>Customer Support:</b> <br />
          Online Support 24/7
        </span>
      </div>
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/banners/65b387e6e4171.webp"
          alt="Fast Shipping"
          className="h-12 aspect-square"
        />
        <span>
          <b>Delivery Time:</b> <br />
          Fast Shipping & Return
        </span>
      </div>
      <div className="flex items-center gap-2 lg:border-l-3 py-2 pl-4">
        <img
          src="https://www.techhunk.pk/images/banners/65b387e6e42bb.webp"
          alt="Return & Exchange"
          className="h-12 aspect-square"
        />
        <span>
          <b>Return & Exchange:</b> <br />
          Secure Payment
        </span>
      </div>
    </div>
  );
}
