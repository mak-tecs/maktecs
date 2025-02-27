"use client";

import AddToCartButton from "@/app/components/AddToCartButton";
import FavoriteButton from "@/app/components/FavoriteButton";
import AuthContextProvider from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Purchase({ product }) {
  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState(
    product?.variants?.[0]?.color || null
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.variants?.[0]?.size || ""
  );

  const colors = useMemo(() => {
    return product?.variants && product?.variants.length > 0
      ? Array.from(
          new Set(
            product?.variants
              ?.filter?.(
                (variant) =>
                  variant.color &&
                  (!selectedSize || variant.size == selectedSize)
              )
              ?.map?.(({ color }) => color) || []
          )
        )
      : [];
  }, [product, selectedSize]);

  const sizes = useMemo(() => {
    return product?.variants && product?.variants.length > 0
      ? Array.from(
          new Set(
            product?.variants
              ?.filter?.(
                (variant) =>
                  variant.size &&
                  (!selectedColor || variant.color?.name == selectedColor?.name)
              )
              ?.map?.(({ size }) => size) || []
          )
        )
      : [];
  }, [product, selectedColor]);

  useEffect(
    () => console.log({ product, selectedColor, selectedSize, colors, sizes }),
    [product, selectedColor, selectedSize, colors, sizes]
  );

  return (
    <>
      {/* {colors?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-sm">Colors:</h4>
          <div className="flex gap-2">
            {colors.map((color, index) =>
                <div
                  key={index}
                  style={{
                    backgroundColor: color.code,
                    border: `3px solid ${
                        color.name == selectedColor?.name ? "gray" : "transparent"
                    }`,
                  }}
                  className="w-10 aspect-square rounded-md border cursor-pointer"
                  title={color.name}
                  onClick={() => setSelectedColor(color)}
                />
            )}
          </div>
        </div>
      )}

      {sizes?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-sm">Sizes:</h4>
          <div className="flex gap-2">
            {sizes.map((size, index) => (
              <span
                key={index}
                style={{
                  border: `3px solid ${
                    size == selectedSize ? "gray" : "transparent"
                  }`,
                }}
                className="px-2 py-1 rounded-full min-w-12 text-center cursor-pointer"
                title={size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )} */}

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/checkout?type=buynow&productId=${product?.id}`);
          }}
          className="flex-1 bg-gray-700 text-white p-4 rounded-lg text-medium w-full"
        >
          Buy Now
        </button>
        <AuthContextProvider>
          <AddToCartButton type={"cute"} productId={product?.id} />
        </AuthContextProvider>
        <AuthContextProvider>
          <FavoriteButton productId={product?.id} />
        </AuthContextProvider>
      </div>
    </>
  );
}
