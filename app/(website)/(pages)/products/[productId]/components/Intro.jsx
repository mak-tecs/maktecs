import Category from "./Category";
import Brand from "./Brand";
import RatingReview from "./RatingReview";
import Purchase from "./Purchase";
import { Suspense } from "react";

export default function Intro({ product }) {
  return (
    <div className="w-full flex flex-col gap-3 px-5">
      <div className="flex gap-3">
        <Category categoryId={product?.categoryId} />
        {/* <Brand brandId={product?.brandId} /> */}
      </div>
      <h1 className="font-semibold text-xl md:text-4xl">{product?.title}</h1>
      <h3 className="text-green-500 font-bold text-lg">
        Rs {product?.salePrice}{" "}
        <span className="line-through text-gray-700 text-sm">
          Rs {product?.price}
        </span>
      </h3>
      <h2 className="text-gray-600 text-sm line-clamp-3 md:line-clamp-4">
        {product?.shortDescription}
      </h2>

      <Suspense fallback="">
      <RatingReview product={product} />
      </Suspense>

      <Purchase product={product} />

      {product?.stock <= (product?.orders ?? 0) && (
        <div className="flex">
          <h3 className="text-red-500 py-1 rounded-lg text-sm font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}
    </div>
  );
}
