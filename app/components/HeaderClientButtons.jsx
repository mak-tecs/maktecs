"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Badge } from "@nextui-org/react";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useLocalCart } from "../hooks/useLocalCart";
import { useLocalFavorites } from "../hooks/useLocalFavorites";

export default function HeaderClientButtons({ forMobile = false }) {
  const auth = useAuth();
  const user = auth?.user;
  const { data } = useUser({ uid: user?.uid });
  const { cart } = useLocalCart();
  const { favorites } = useLocalFavorites();

  const favoritesItems = user ? data?.favorites : favorites;
  const cartItems = user ? data?.carts : cart;
  
  return (
    <div className="flex items-center gap-1">
      {!!!forMobile && (
        <Link href={`/favorites`}>
          {(favoritesItems?.length || 0) != 0 && (
            <Badge
              variant="solid"
              size="sm"
              className="text-white bg-red-500 text-[8px]"
              content={
                favoritesItems?.length || 0
              }
            >
              <button
                title="My Favorites"
                className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
              >
                <Heart size={14} />
              </button>
            </Badge>
          )}
          {(favoritesItems?.length || 0) === 0 && (
            <button
              title="My Favorites"
              className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
            >
              <Heart size={14} />
            </button>
          )}
        </Link>
      )}
      <Link href={`/cart`}>
        {(cartItems?.length|| 0) != 0 && (
          <Badge
            variant="solid"
            size="sm"
            className="text-white bg-red-500 text-[8px]"
            content={
              cartItems?.length || 0
            }
          >
            <button
              title="My Cart"
              className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
            >
              <ShoppingCart size={14} />
            </button>
          </Badge>
        )}
        {(cartItems?.length || 0) === 0 && (
          <button
            title="My Cart"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <ShoppingCart size={14} />
          </button>
        )}
      </Link>
    </div>
  );
}
