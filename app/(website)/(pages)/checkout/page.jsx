"use client";

import { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProductsByIds } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useLocalCart } from "@/app/hooks/useLocalCart"; // Import local cart hook
import Checkout from "./components/Checkout";

function CheckoutPage() {
  const auth = useAuth();
  const user = auth?.user;
  const { data: userData, isLoading: isUserLoading } = useUser({ uid: user?.uid });
  const { cart } = useLocalCart();  // Use local cart when user is not logged in

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(true);

  // Determine product ids based on user status
  const productIdsList = type === "buynow"
    ? [productId]
    : user ? userData?.carts?.map((item) => item?.id) : cart.map(item => item.id);

  const {
    data: products,
    error,
    isLoading: isProductsLoading,
  } = useProductsByIds({
    idsList: productIdsList,
  });

  // Manage loading state
  useLayoutEffect(() => {
    if (!user) setLoading(false);
  }, []);

  useEffect(() => {
    if (user) setLoading(isUserLoading || isProductsLoading);
  }, [isUserLoading, isProductsLoading, user]);

  if (loading) {
    return <div><CircularProgress /></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productIdsList || productIdsList.length === 0) {
    return <div><h1>Products Not Found</h1></div>;
  }

  const productList = type === "buynow"
    ? [
        {
          id: productId,
          quantity: 1,
          product: products?.[0],
        },
      ]
    : (user ? userData?.carts : cart)?.map((item) => ({
        ...item,
        product: products?.find((e) => e?.id === item?.id),
      }));

  return (
    <main className="p-5 flex flex-col gap-4">
      <h1 className="text-xl">Checkout</h1>
      <Checkout productList={productList} />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div><CircularProgress /></div>}>
      <CheckoutPage />
    </Suspense>
  );
}