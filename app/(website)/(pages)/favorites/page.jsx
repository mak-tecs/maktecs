"use client";

import { ProductCard } from "@/app/components/Products";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useLocalFavorites } from "@/app/hooks/useLocalFavorites"; // Import your local favorites hook
import { useEffect, useLayoutEffect, useState } from "react";

export default function Page() {
  const auth = useAuth();
  const user = auth?.user;
  const { data, isLoading: isUserLoading } = useUser({ uid: user?.uid });

  // Use the local favorites hook for non-auth users
  const { favorites } = useLocalFavorites();

  // A state to manage the combined loading state
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!user) setLoading(false);
  }, []);
  useEffect(() => {
    // Adjust loading status only if the user is authenticated
    if (user) setLoading(isUserLoading);
  }, [isUserLoading]);

  if (loading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }

  const favoriteItems = user ? data?.favorites : favorites;

  return (
    <main className="flex flex-col gap-3 justify-center items-center p-5">
      <h1 className="text-center mb-5 text-4xl uppercase">Favorites</h1>
      {!favoriteItems || favoriteItems.length === 0 ? (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Favorites
          </h1>
        </div>
      ) : (
        <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {favoriteItems.map((productId) => (
            <ProductItem productId={productId} key={productId} />
          ))}
        </div>
      )}
    </main>
  );
}

function ProductItem({ productId }) {
  const { data: product } = useProduct({ productId: productId });
  return product ? <ProductCard product={product} /> : null;
}
