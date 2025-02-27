"use client";

import { useAllOrders } from "@/lib/firestore/orders/read";
import { useProducts } from "@/lib/firestore/products/read";
import { deleteProduct } from "@/lib/firestore/products/write";
import { useUser } from "@/lib/firestore/user/read";
import { Avatar, Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all"); // New state for status filter
  const [selectedDateFilter, setSelectedDateFilter] = useState("all"); // New state for date filter

  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  const {
    data: orders,
    error,
    isLoading,
    lastSnapDoc,
  } = useAllOrders({
    pageLimit: pageLimit,
    lastSnapDoc:
      lastSnapDocList?.length === 0
        ? null
        : lastSnapDocList[lastSnapDocList?.length - 1],
  });

  const handleNextPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.push(lastSnapDoc);
    setLastSnapDocList(newStack);
  };

  const handlePrePage = () => {
    let newStack = [...lastSnapDocList];
    newStack.pop();
    setLastSnapDocList(newStack);
  };
  const filterByDate = (order) => {
    const { seconds, nanoseconds } = order.checkout.createdAt;
    const orderDate = new Date(seconds * 1000 + nanoseconds / 1000000); // Convert to milliseconds
    const now = new Date();
    switch (selectedDateFilter) {
      case "today":
        return orderDate.toDateString() === now.toDateString();
      case "yesterday":
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      case "thisMonth":
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      case "lastMonth":
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        return (
          orderDate.getMonth() === lastMonth.getMonth() &&
          orderDate.getFullYear() === lastMonth.getFullYear()
        );
      case "thisYear":
        return orderDate.getFullYear() === now.getFullYear();
      case "lastYear":
        return orderDate.getFullYear() === now.getFullYear() - 1;
      default:
        return true;
    }
  };

  const filteredOrders = orders?.filter(
    (order) =>
      (selectedStatus === "all" || order.status === selectedStatus) &&
      filterByDate(order)
      
  );

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }
  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl w-full overflow-x-auto">
      <div className="flex items-center mb-3">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 mx-2 border-2 rounded-l"
          name="statusFilter"
          id="statusFilter"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="in transit">In Transit</option>
          <option value="packed">Packed</option>
          <option value="picked up">Picked Up</option>
          <option value="out for delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
        </select>

        <select
          value={selectedDateFilter}
          onChange={(e) => setSelectedDateFilter(e.target.value)}
          className="p-2 mx-2 border-2 rounded-l"
          name="dateFilter"
          id="dateFilter"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Customer
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Total Price
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Total Products
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Payment Mode
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Order Date
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Status
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {/* {orders?.map((item, index) => {
            return (
              <Row
                index={index + lastSnapDocList?.length * pageLimit}
                item={item}
                key={item?.id}
              />
            );
          })} */}
{filteredOrders?.map((item, index) => {
            return (
              <Row
                index={index + lastSnapDocList?.length * pageLimit}
                item={item}
                key={item?.id}
              />
            );
          })}

        </tbody>
      </table>
      <div className="flex justify-between text-sm py-3">
        <Button
          isDisabled={isLoading || lastSnapDocList?.length === 0}
          onClick={handlePrePage}
          size="sm"
          variant="bordered"
        >
          Previous
        </Button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(e.target.value)}
          className="px-5 rounded-xl"
          name="perpage"
          id="perpage"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
        </select>
        <Button
          isDisabled={isLoading || orders?.length === 0}
          onClick={handleNextPage}
          size="sm"
          variant="bordered"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const totalAmount = item?.checkout?.line_items?.reduce((prev, curr) => {
    return prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity;
  }, 0);
  const { data: user } = useUser({ uid: item?.uid });
  const orderDate = new Date(item?.checkout?.createdAt?.seconds * 1000 + item?.checkout?.createdAt?.nanoseconds / 1000000);

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        <div className="flex gap-2 items-center">
          <Avatar size="sm" src={user?.photoURL} />
          <div className="flex flex-col">
          {/* <h1> {JSON.parse(item.metadata.address)?.fullName}</h1> */}
            <h1 className="text-xs text-gray-600"> {user?.email}</h1>
          </div>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2  whitespace-nowrap">
        Rs {totalAmount}
      </td>
      <td className="border-y bg-white px-3 py-2">
        {item?.checkout?.line_items?.length}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
            {item?.paymentMode}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        {orderDate.toLocaleDateString()} {/* Display the order date */}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          <h3  className={`text-xs rounded-lg px-2 py-1 uppercase ${
              item?.status === "pending"
                ? "bg-orange-500 text-orange-100"
                : item?.status === "cancelled"
                ? "bg-red-500 text-red-100"
                : item?.status === "in transit"
                ? "bg-blue-500 text-blue-100"
                : item?.status === "packed"
                ? "bg-gray-500 text-gray-100"
                : item?.status === "picked up"
                ? "bg-teal-500 text-teal-100"
                : item?.status === "out for delivery"
                ? "bg-green-500 text-green-100"
                : item?.status === "delivered"
                ? "bg-green-700 text-white"
                : "bg-green-100 text-green-500"
            }`}>
            {item?.status ?? "pending"}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex">
          <Link href={`/admin/orders/${item?.id}`}>
            <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">
              View
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}
