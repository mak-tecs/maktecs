"use client";

import { useConfirm } from "@/app/hooks/useConfirm";
import { useLocalCart } from "@/app/hooks/useLocalCart";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const auth = useAuth();
  const user = auth?.user;
  const { data, isLoading } = useUser({ uid: user?.uid });
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if(!user) setLoading(false);
  }, []);
  useEffect(()=>{
    if(user) setLoading(isLoading)
  }, [isLoading])

  const { cart } = useLocalCart();

  if (loading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }

  const cartItems = user ? data?.carts : cart;

  console.log({cartItems, data, cart, user})

  return (
    <main className="flex flex-col gap-3 justify-center items-center p-5">
      <h1 className="text-center mb-5 text-4xl uppercase">Cart</h1>
      {!cartItems || cartItems.length === 0 ? (
        <>
          <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
            <div className="flex justify-center">
              <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="" />
            </div>
            <h1 className="text-gray-600 font-semibold">
              Please Add Products To Cart
            </h1>
          </div>
          <Link href={`/`}>
            <button className="bg-blue-500 px-5 py-2 text-sm rounded-lg text-white">
              Continue Shopping
            </button>
          </Link>
        </>
      ) : (
        <>
          <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2">
            {cartItems.map((item, key) => {
              return <ProductItem item={item} key={item.id} isUserLoggedIn={!!user} />;
            })}
          </div>
          <div>
            <Link href={`/checkout?type=cart`}>
            <button className="flex-1 bg-gray-700 text-white p-4 rounded-lg text-medium w-full">
            Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

function ProductItem({ item, isUserLoggedIn }) {
  const auth = useAuth();
  const user = auth?.user;
  const { data } = useUser({ uid: user?.uid });

  // Use the local cart hook for non-authenticated users
  const { removeFromCart, updateCartQuantity } = useLocalCart();

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: product } = useProduct({ productId: item?.id });
  const confirmModal = useConfirm();

  const handleRemove = async () => {
    if (!(await confirmModal("Are you sure?"))) return;
    setIsRemoving(true);
    try {
      if (isUserLoggedIn) {
        const newList = data?.carts?.filter((d) => d?.id !== item?.id);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        removeFromCart(item?.id);
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity) => {
    setIsUpdating(true);
    try {
      if (isUserLoggedIn) {
        const newList = data?.carts?.map((d) => {
          if (d?.id === item?.id) {
            return {
              ...d,
              quantity: parseInt(quantity),
            };
          } else {
            return d;
          }
        });
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        updateCartQuantity(item?.id, quantity);
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-3 items-center border rounded-xl overflow-hidden">
      <div className="h-[100px] aspect-square">
        <img
          className="h-full object-cover"
          src={product?.featureImageURL}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <h1 className="text-sm font-semibold">{product?.title}</h1>
        <h1 className="text-green-500 text-sm">
          Rs {product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-500">
            Rs {product?.price}
          </span>
        </h1>
        <div className="flex text-xs items-center gap-2">
          <Button
            onClick={() => {
              handleUpdate(item?.quantity - 1);
            }}
            isDisabled={isUpdating || item?.quantity <= 1}
            isIconOnly
            size="sm"
            className="h-6 w-4"
          >
            <Minus size={12} />
          </Button>
          <h2>{item?.quantity}</h2>
          <Button
            onClick={() => {
              handleUpdate(item?.quantity + 1);
            }}
            isDisabled={isUpdating}
            isIconOnly
            size="sm"
            className="h-6 w-4"
          >
            <Plus size={12} />
          </Button>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <Button
          className="mr-5"
          onClick={handleRemove}
          isLoading={isRemoving}
          isDisabled={isRemoving}
          isIconOnly
          color="danger"
          size="sm"
        >
          <X size={13} />
        </Button>
      </div>
    </div>
  );
}