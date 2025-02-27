"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  createCheckoutAndGetURL,
  createCheckoutCODAndGetId,
} from "@/lib/firestore/checkout/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { useState, useEffect, useLayoutEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckSquare2Icon } from "lucide-react";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useLocalCart } from "@/app/hooks/useLocalCart";

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState("cod");
  const [orderDetails, setOrderDetails] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;

  const { clearCart } = useLocalCart();

  // Assume this function gets the address from local storage if not logged in
  const loadAddress = () => {
    if (!user) {
      const savedAddress = JSON.parse(localStorage.getItem('orderDetails')) || {};
      setOrderDetails(savedAddress);
    }
  };

  useLayoutEffect(() => {
    if (!user) {
      setIsLoading(false);
      loadAddress(); // Load address from local storage if unauthenticated
    }
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(false); // Consider setting up Firebase calls to fetch user address if applicable
    }
  }, [user]);

  const handleOrderChange = (key, value) => {
    const newOrderDetails = { ...orderDetails, [key]: value };
    setOrderDetails(newOrderDetails);
    if (!user) {
      localStorage.setItem('orderDetails', JSON.stringify(newOrderDetails));
    }
  };

  const handlePlaceOrder = async () => {
    setSubmitLoading(true);
    try {
      if (totalPrice <= 0) {
        throw new Error("Price should be greater than 0");
      }

      if (!orderDetails?.fullName || !orderDetails?.mobile) {
        throw new Error("Please Fill All Personal Details");
      }

      // const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      // if (!emailPattern.test(orderDetails?.email)) {
      //   throw new Error("Please enter a valid email address");
      // }  

      const phoneUtil = PhoneNumberUtil.getInstance();
      const number = phoneUtil.parse(orderDetails.mobile, 'PK');
      if (!phoneUtil.isValidNumberForRegion(number, 'PK')) {
        throw new Error("Please enter a valid Pakistan phone number");
      }

      if (!orderDetails?.addressLine1 || !orderDetails?.pincode || !orderDetails?.city || !orderDetails?.state) {
        throw new Error("Please Fill All Address Details");
      }

      if (!productList || productList?.length === 0) {
        throw new Error("Product List Is Empty");
      }

      if (!agreeToTerms) {
        throw new Error("You must agree to the terms & conditions");
      }

      if (paymentMode != "cod") {
        const url = await createCheckoutAndGetURL({
          uid: user ? user.uid : "I6BPQGGYZObEdvNL2pPM",
          products: productList,
          orderDetails,
        });
        router.push(url);
      } else {
        const checkoutId = await createCheckoutCODAndGetId({
          uid: user?.uid || 'I6BPQGGYZObEdvNL2pPM',  // Use Guest id for non-logged users
          products: productList,
          orderDetails,
        });
        router.push(`/checkout-cod/${checkoutId}`);
        toast.success("Order placed successfully!");
        confetti();
        clearCart();
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setSubmitLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <CircularProgress />
      </div>
    );
  }

  const totalPrice = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * curr?.product?.salePrice;
  }, 0);

  return (
    <section className="flex flex-col md:flex-row gap-3">
      <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
        <h1 className="text-xl">Shipping Address</h1>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Full Name"
            value={orderDetails.fullName || ""}
            onChange={(e) => handleOrderChange("fullName", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={orderDetails.mobile || ""}
            onChange={(e) => handleOrderChange("mobile", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="email"
            placeholder="Email (Optional)"
            value={orderDetails.email || ""}
            onChange={(e) => handleOrderChange("email", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Address Line 1"
            value={orderDetails.addressLine1 || ""}
            onChange={(e) => handleOrderChange("addressLine1", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Address Line 2 (Optional)"
            value={orderDetails.addressLine2 || ""}
            onChange={(e) => handleOrderChange("addressLine2", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="number"
            max={100}
            placeholder="Pincode"
            value={orderDetails.pincode || ""}
            onChange={(e) => handleOrderChange("pincode", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="City"
            value={orderDetails.city || ""}
            onChange={(e) => handleOrderChange("city", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="State"
            value={orderDetails.state || ""}
            onChange={(e) => handleOrderChange("state", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
          <textarea
            placeholder="Delivery Notes (Optional)"
            value={orderDetails.orderNote || ""}
            onChange={(e) => handleOrderChange("orderNote", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>
      </section>

      <div className="flex-1 flex flex-col gap-3">
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <h1 className="text-xl">Products</h1>
          <div className="flex flex-col gap-2 pb-5 border-b">
            {productList?.map((item) => {
              return (
                <div className="flex gap-3 items-center">
                  <img
                    className="w-10 h-10 object-cover rounded-lg"
                    src={item?.product?.featureImageURL}
                    alt=""
                  />
                  <div className="flex-1 flex flex-col">
                    <h1 className="text-sm">{item?.product?.title}</h1>
                    <h3 className="text-green-600 font-semibold text-[10px]">
                      Rs {item?.product?.salePrice}{" "}
                      <span className="text-black">X</span>{" "}
                      <span className="text-gray-600">{item?.quantity}</span>
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-sm">
                      Rs {item?.product?.salePrice * item?.quantity}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between w-full items-center px-2">
            <h1>Subtotal</h1>
            <h1>Rs {productList.reduce((total, item) => total + item.product?.price * item.quantity, 0)}</h1>
          </div>
          <div className="flex justify-between w-full items-center px-2">
            <h1>Discount</h1>
            <h1>Rs {productList.reduce((total, item) => total + (item.product?.price - item.product?.salePrice) * item.quantity, 0)}</h1>
          </div>
          <div className="flex justify-between w-full items-center px-2">
            <h1>Shipping</h1>
            <h1>Rs 0</h1>
          </div>
          <div className="flex justify-between w-full items-center p-2 font-semibold">
            <h1>Total</h1>
            <h1>Rs {totalPrice}</h1>
          </div>
        </section>

        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-xl">Payment Mode</h2>
          </div>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => toast("Coming Soon")}
              className={`flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${
                paymentMode === "prepaid" ? "bg-blue-100" : "bg-gray-100"
              } hover:bg-gray-200`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="prepaid"
                disabled={true}
                checked={paymentMode === "prepaid"}
                readOnly
                className="cursor-pointer"
              />
              Card Payment
            </button>
            <button
              onClick={() => toast("Coming Soon")}
              className={`flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${
                paymentMode === "prepaid" ? "bg-blue-100" : "bg-gray-100"
              } hover:bg-gray-200`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="prepaid"
                disabled={true}
                checked={paymentMode === "prepaid"}
                readOnly
                className="cursor-pointer"
              />
              EasyPaisa
            </button>
            <button
              onClick={() => toast("Coming Soon")}
              className={`flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${
                paymentMode === "prepaid" ? "bg-blue-100" : "bg-gray-100"
              } hover:bg-gray-200`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="prepaid"
                disabled={true}
                checked={paymentMode === "prepaid"}
                readOnly
                className="cursor-pointer"
              />
              JazzCash
            </button>
            <button
              onClick={() => setPaymentMode("cod")}
              className={`flex w-full items-center gap-1 p-2 text-xs rounded-md cursor-pointer transition-colors duration-150 ${
                paymentMode === "cod" ? "bg-blue-100" : "bg-gray-100"
              } hover:bg-blue-200`}
            >
              <input
                type="radio"
                name="paymentMode"
                value="cod"
                checked={paymentMode === "cod"}
                readOnly
                className="cursor-pointer"
              />
              Cash On Delivery
            </button>
          </div>
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              width={100}
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <h4 className="text-xs text-gray-600">
              I agree with the{" "}
              <span className="text-blue-700">terms & conditions</span>
            </h4>
          </div>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handlePlaceOrder}
            className="bg-black text-white"
          >
            Place Order
          </Button>
        </section>
      </div>
    </section>
  );
}