"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { CircularProgress } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useLocalCart } from "@/app/hooks/useLocalCart"; // Import local cart hook
import { useEffect, useLayoutEffect, useState, Suspense } from "react";

function CheckoutLayout({ children }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const productId = searchParams.get("productId");

  const auth = useAuth();
  const user = auth?.user;
  const { data, error, isLoading } = useUser({ uid: user?.uid });

  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!user) setLoading(false);
  }, []);
  useEffect(() => {
    if (user) setLoading(isLoading);
  }, [isLoading]);

  const { cart } = useLocalCart(); // Use local cart for non-authenticated users

  if (loading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (user && error) {
    return <div>{error}</div>;
  }

  if (
    type === "cart" &&
    ((!user && cart.length === 0) ||
      (user && (!data?.carts || data?.carts?.length === 0)))
  ) {
    return (
      <div>
        <h2>Your Cart Is Empty</h2>
      </div>
    );
  }

  if (type === "buynow" && !productId) {
    return (
      <div>
        <h2>Product Not Found!</h2>
      </div>
    );
  }

  return <>{children}</>;
}

export default function LayoutWrapper({ children }) {
  return (
    <Suspense fallback={<div><CircularProgress /></div>}>
      <CheckoutLayout>{children}</CheckoutLayout>
    </Suspense>
  );
}