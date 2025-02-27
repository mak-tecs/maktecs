"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/lib/firestore/orders/read";
import { useReviews } from "@/lib/firestore/reviews/read";
import { addReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Rating } from "@mui/material";
import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddReview({ productId }) {
  const { user } = useAuth();
  const {
    data: orders,
    error: ordersError,
    isLoading: ordersLoading,
  } = useOrders({ uid: user?.uid });
  const { data: reviews } = useReviews({ productId });

  useEffect(()=>console.log({orders, reviews}), [orders])

  function isWithinLast30Days(timestamp) {
    if(!timestamp) return false;
    const date = new Date(timestamp.seconds * 1000);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
    return date >= sevenDaysAgo;
}


  const hasDeliveredOrder = orders?.some(
    (order) => order?.checkout?.line_items?.find(product=>(
      product?.price_data?.product_data?.metadata?.productId == productId
    )) && order.status == "delivered" && isWithinLast30Days(order?.timestampStatusUpdate)
  );
  const hasReviewed = reviews?.some((review) => review.uid === user?.uid);

  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const { data: userData } = useUser({ uid: user?.uid });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("Please Logged In First");
      }
      await addReview({
        displayName: userData?.displayName,
        message: message,
        photoURL: userData?.photoURL,
        productId: productId,
        rating: rating,
        uid: user?.uid,
      });
      setMessage("");
      toast.success("Successfully Submitted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (!hasDeliveredOrder || hasReviewed) {
    return null; // Or some message saying they can't review yet
  }

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Rate This Products</h1>
      <Rating
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        type="text"
        placeholder="Enter you thoughts on this products ..."
        className="w-full border border-lg px-4 py-2 focus:outline-none"
      />
      <Button
        onClick={handleSubmit}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Submit
      </Button>
    </div>
  );
}
