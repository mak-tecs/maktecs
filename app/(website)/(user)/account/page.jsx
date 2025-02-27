"use client";
import { auth } from "@/lib/firebase";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { updateUser } from "@/lib/firestore/user/write"; // Existing import
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/firestore/user/read";
import { Pencil } from "lucide-react";
import { Button, Input } from "@nextui-org/react";
import { useOrders } from "@/lib/firestore/orders/read";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/vercel.blob";

export default function Page() {
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });
  const {
    data: orders,
    error: ordersError,
    isLoading: ordersLoading,
  } = useOrders({ uid: user?.uid });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log({userData})
    // Assuming userData is provided via a useUser hook or similar
    if (userData) {
      setDisplayName(userData.displayName ?? "");
      setPhotoURL(userData.photoURL ?? "");
    }
  }, [userData]);

  const handleProfilePicChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const newPhotoURL = await uploadFile("profile-pics/", file);
        if (newPhotoURL) {
          setPhotoURL(newPhotoURL);
          setIsChanged(true);
        }
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        toast.error("Failed to upload profile picture. Please try again.");
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (password) {
        if (!currentPassword) {
          toast.error("Please enter your current password for verification");
          setLoading(false);
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(auth.currentUser, password);
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
      }

      if (displayName != user.displayName || photoURL != user.photoURL) {
        await updateUser({ uid: user.uid, displayName, photoURL });
        toast.success("Profile updated successfully");
        setIsChanged(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-4 py-[100px] px-4 md:px-16">
      <h1 className="text-2xl font-semibold">My Account</h1>
      <div className="flex flex-col gap-2 items-center">
        <div className="relative">
          <img
            className="rounded-full h-24 w-24 mb-2"
            src={photoURL || "/blank-profile-picture.png"}
            alt="Profile"
          />
          <div
            className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-2 cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <Pencil size={"20px"} />
          </div>
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleProfilePicChange}
        />
        <h3 className="w-full ml-3 mt-4 text-left">General</h3>
        <Input
          label="Display Name"
          value={displayName || ""}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setIsChanged(true);
          }}
        />
        <h3 className="w-full ml-3 mt-4 text-left">Password</h3>
        <Input
          label="Current Password"
          type="password"
          value={currentPassword || ""}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
          }}
        />
        <Input
          label="New Password"
          type="password"
          value={password || ""}
          onChange={(e) => {
            setPassword(e.target.value);
            setIsChanged(true);
          }}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword || ""}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setIsChanged(true);
          }}
        />
        <Button disabled={!isChanged || loading} onClick={handleUpdateProfile}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>

      <h1 className="text-2xl font-semibold">My Orders</h1>
      {ordersLoading ? (
        <div className="flex justify-center py-48">
          <CircularProgress />
        </div>
      ) : ordersError ? (
        <>{ordersError}</>
      ) : (
        <OrderList orders={orders} />
      )}
    </main>
  );
}

function OrderList({ orders }) {
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-500";
      case "packed":
      case "picked up":
      case "in transit":
      case "out for delivery":
        return "bg-green-100 text-green-500";
      case "delivered":
        return "bg-black text-white";
      case "cancelled":
        return "bg-red-100 text-red-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div>
      {!orders || orders?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-11">
          <div className="flex justify-center">
            <img className="h-44" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1>You have no orders</h1>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders?.map((item, orderIndex) => {
            const totalAmount = item?.checkout?.line_items?.reduce(
              (prev, curr) => {
                return (
                  prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity
                );
              },
              0
            );
            return (
              <div
                key={orderIndex}
                className="flex flex-col gap-2 border rounded-lg p-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3">
                    <h3>{orderIndex + 1}</h3>
                    <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
                      {item?.paymentMode}
                    </h3>
                    <h3
                      className={`text-xs rounded-lg px-2 py-1 uppercase ${getStatusClass(
                        item?.status ?? "pending"
                      )}`}
                    >
                      {item?.status ?? "pending"}
                    </h3>
                    <h3 className="text-green-600">Rs {totalAmount}</h3>
                  </div>
                  <h4 className="text-gray-600 text-xs">
                    {item?.timestampCreate?.toDate().toLocaleString()}
                  </h4>
                </div>
                <div className="flex flex-col gap-2">
                  {item?.checkout?.line_items?.map((product, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <img
                        className="h-10 w-10 rounded-lg"
                        src={product?.price_data?.product_data?.images?.[0]}
                        alt="Product Image"
                      />
                      <div>
                        <h1 className="">
                          {product?.price_data?.product_data?.name}
                        </h1>
                        <h1 className="text-gray-500 text-xs">
                          Rs {product?.price_data?.unit_amount / 100}{" "}
                          <span>X</span>{" "}
                          <span>{product?.quantity?.toString()}</span>
                        </h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
