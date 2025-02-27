"use client"
import React from "react";
import { LocalStorageProvider } from "@/contexts/LocalStorageContext";

export default function Layout({ children }) {
  return (
   <LocalStorageProvider>
    {children}
   </LocalStorageProvider>
  );
}