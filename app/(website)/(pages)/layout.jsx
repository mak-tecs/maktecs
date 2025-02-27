// Import React
import React from "react";
// Import other components
import AuthContextProvider from "@/contexts/AuthContext";
import GeneriConBanner from "@/app/components/GeneriConBanner";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Import the WhatsApp logo

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <main>
        {/* <GeneriConBanner /> */}
        <Header />
        {children}
        <Footer />

        {/* WhatsApp link and logo */}
        <a
          href="https://wa.me/923445569902"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50"
        >
          <img
            src={"/whatsapp-logo.jpg"}
            alt="WhatsApp"
            className="w-16 rounded-2xl" // Tailwind classes for size
          />
        </a>
      </main>
    </AuthContextProvider>
  );
}
