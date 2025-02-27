"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import { useLocalCart } from "../hooks/useLocalCart";

export default function AddToCartButton({ productId, type }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const { cart, addToCart, removeFromCart } = useLocalCart();
  const router = useRouter();

  const isAdded = user 
    ? data?.carts?.find((item) => item?.id === productId)
    : cart.find((item) => item.id === productId);

  const handlClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        if (isAdded) {
          removeFromCart(productId);
        } else {
          addToCart({ id: productId, quantity: 1 });
        }
      }
      else {
        if (isAdded) {
          const newList = data?.carts?.filter((item) => item?.id != productId);
          await updateCarts({ list: newList, uid: user?.uid });
        } else {
          await updateCarts({
            list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
            uid: user?.uid,
          });
        }
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (type === "cute") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handlClick}
        className="!rounded-[7px] h-full p-4 !px-6"
        variant="bordered"
      >
        {!isAdded && "Add To Cart"}
        {isAdded && "Click To Remove"}
      </Button>
    );
  }

  if (type === "large") {
    return (
      <Button
        isLoading={isLoading}
        isDisabled={isLoading}
        onClick={handlClick}
        variant="bordered"
        className="!rounded-[7px] h-full p-4"
        color="primary"
        size="sm"
      >
        {!isAdded && <AddShoppingCartIcon className="text-xs" />}
        {isAdded && <ShoppingCartIcon className="text-xs" />}
        {!isAdded && "Add To Cart"}
        {isAdded && "Click To Remove"}
      </Button>
    );
  }

  return (
    <Button
      isLoading={isLoading}
      isDisabled={isLoading}
      onClick={handlClick}
      className="!rounded-[7px] !h-full !px-6"
      variant="flat"
      isIconOnly
      // size="lg"
    >
      {!isAdded && <AddShoppingCartIcon className="text-xl" />}
      {isAdded && <ShoppingCartIcon className="text-xl" />}
    </Button>
  );
}
