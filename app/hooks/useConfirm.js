"use client"
import { createContext, useContext } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const confirm = async (message) => {
    return new Promise((resolve) => {
      window.dispatchEvent(
        new CustomEvent("open-confirm-modal", {
          detail: { message, resolve },
        })
      );
    });
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}
