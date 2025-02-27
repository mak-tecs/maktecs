"use client";

import { useConfirm } from "@/app/hooks/useConfirm";
import { useAdvertisements } from "@/lib/firestore/advertisement/read";
import { deleteAdvertisement, updateAdvertisement } from "@/lib/firestore/advertisement/write";
import { Button, CircularProgress } from "@nextui-org/react";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: advertisements, error, isLoading } = useAdvertisements();

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
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <h1 className="text-xl">Advertisements</h1>
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Link
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2">Size</th>
            <th className="font-semibold border-y bg-white px-3 py-2">Clicks</th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {advertisements?.map((item, index) => {
            return <Row index={index} item={item} key={item?.id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

function Row({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActive, setIsActive] = useState(item?.active ?? true);
  const router = useRouter();
  const confirmModal = useConfirm();

  const handleDelete = async () => {
    if (!(await confirmModal("Are you sure you want to delete this advertisement?"))) return;
    setIsDeleting(true);
    try {
      await deleteAdvertisement({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/advertisements?id=${item?.id}`);
  };

  const toggleActiveStatus = async () => {
    const newActiveStatus = !isActive;
    setIsActive(newActiveStatus);

    try {
      await updateAdvertisement({
        data: { ...item, active: newActiveStatus },
        addImage: null, // Assuming you are not changing the image during activation toggle
      });
      toast.success(`Advertisement ${newActiveStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error(error?.message);
      // Revert the local state change on error
      setIsActive(!newActiveStatus);
    }
  };

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <div className="flex justify-center">
          <img className="h-7 object-cover" src={item?.addImage} alt="" />
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.link}</td>
      <td className="border-y bg-white px-3 py-2 text-center">{item?.size}</td>
      <td className="border-y bg-white px-3 py-2 text-center">{item?.clicks}</td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center">
          <Button onClick={handleUpdate} isDisabled={isDeleting} isIconOnly size="sm">
            <Edit2 size={13} />
          </Button>
          <Button onClick={toggleActiveStatus} isDisabled={isDeleting} isIconOnly size="sm">
            {isActive ? <EyeOff size={13} /> : <Eye size={13} />}
          </Button>
          <Button onClick={handleDelete} isLoading={isDeleting} isDisabled={isDeleting} isIconOnly size="sm" color="danger">
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  );
}
