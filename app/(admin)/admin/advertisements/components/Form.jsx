"use client";

import { getAdvertisement } from "@/lib/firestore/advertisement/read_server";
import { createAdvertisement, updateAdvertisement } from "@/lib/firestore/advertisement/write";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [data, setData] = useState({ clicks: 0, size: "sm" });
  const [addImage, setAddImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getAdvertisement({ id });
      if (!res) {
        toast.error("Advertisement Not Found!");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => ({ ...(prevData ?? {}), [key]: value }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createAdvertisement({ data, addImage });
      toast.success("Successfully Created");
      setData({ clicks: 0 });
      setAddImage(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateAdvertisement({ data, addImage });
      toast.success("Successfully Updated");
      setData({ clicks: 0 });
      setAddImage(null);
      router.push(`/admin/advertisements`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{id ? "Update" : "Create"} Advertisement</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleUpdate() : handleCreate();
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="advertisement-image" className="text-gray-500 text-sm">
            Image <span className="text-red-500">*</span> 
          </label>
          {addImage && (
            <div className="flex justify-center items-center p-3">
              <img className="h-20" src={URL.createObjectURL(addImage)} alt="" />
            </div>
          )}
          <input
            onChange={(e) => e.target.files.length > 0 && setAddImage(e.target.files[0])}
            id="advertisement-image"
            name="advertisement-image"
            type="file"
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="advertisement-link" className="text-gray-500 text-sm">
            Link <span className="text-red-500">*</span> 
          </label>
          <input
            id="advertisement-link"
            name="advertisement-link"
            type="url"
            placeholder="Enter URL"
            value={data?.link ?? ""}
            onChange={(e) => handleData("link", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="advertisement-size" className="text-gray-500 text-sm">
            Size <span className="text-red-500">*</span> 
          </label>
          <select
            id="advertisement-size"
            name="advertisement-size"
            value={data?.size ?? "sm"}
            onChange={(e) => handleData("size", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          >
            <option value="sm">Small</option>
            <option value="lg">Large</option>
          </select>
        </div>
        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </form>
    </div>
  );
}