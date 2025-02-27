"use client"
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";

let resolveCallback;

export function ConfirmModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEvent = (e) => {
      setMessage(e.detail.message);
      resolveCallback = e.detail.resolve;
      setOpen(true);
    };
    window.addEventListener("open-confirm-modal", handleEvent);
    return () => window.removeEventListener("open-confirm-modal", handleEvent);
  }, []);

  const handleConfirm = () => {
    setOpen(false);
    resolveCallback(true);
  };

  const handleCancel = () => {
    setOpen(false);
    resolveCallback(false);
  };

  if (!open) return null; // Render nothing if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm p-5">
        <p className="text-lg">{message}</p>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={handleCancel} className="mr-2">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}