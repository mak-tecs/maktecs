"use client";
import { useState } from "react";
import {
  UserCircle2,
  Menu,
  X,
  Home,
  HeartIcon,
  Info,
  Mail,
  Search,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import AuthContextProvider from "@/contexts/AuthContext";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";
import UserDetailsInMenu from "./UserDetailsInMenu";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuList = [
    {
      name: "Home",
      link: "/",
      icon: <Home size={14} />,
      onNavbar: true,
      inDropdown: true,
    },
    {
      name: "Favorite",
      link: "/favorites",
      icon: <HeartIcon size={14} />,
      onNavbar: false,
      inDropdown: true,
    },
    {
      name: "About",
      link: "/about-us",
      icon: <Info size={14} />,
      onNavbar: true,
      inDropdown: true,
    },
    {
      name: "Contact",
      link: "/contact-us",
      icon: <Mail size={14} />,
      onNavbar: true,
      inDropdown: true,
    },
  ];

  const handleMenuClick = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white bg-opacity-65 backdrop-blur-2xl py-3 px-4 md:py-4 md:px-16 border-b flex items-center justify-between">
      <Link href={"/"}>
        <img className="h-4 md:h-5" src="/logos/logo.svg" alt="Logo" />
      </Link>
      <div className="hidden md:flex gap-2 items-center font-semibold">
        {menuList
          .filter((item) => Boolean(item.onNavbar))
          .map((item) => (
            <Link key={item.name} href={item.link}>
              <button className="text-sm px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                {item.name}
              </button>
            </Link>
          ))}
      </div>

      <div className="hidden md:flex items-center gap-1">
        <AuthContextProvider>
          <AdminButton />
        </AuthContextProvider>
        <Link href={`/search?q=`}>
          <button
            title="Search Products"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Search size={14} />
          </button>
        </Link>
        <AuthContextProvider>
          <HeaderClientButtons />
        </AuthContextProvider>
        <Link href={`/account`}>
          <button
            title="My Account"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <UserCircle2 size={14} />
          </button>
        </Link>
        <AuthContextProvider>
          <LogoutButton />
        </AuthContextProvider>
      </div>

      <div className="flex md:hidden items-center gap-1">
        <Link href={`/search?q=`}>
          <button
            title="Search Products"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <Search size={14} />
          </button>
        </Link>
        <AuthContextProvider>
          <HeaderClientButtons forMobile={true} />
        </AuthContextProvider>
        <Link href={`/account`}>
          <button
            title="My Account"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
          >
            <UserCircle2 size={14} />
          </button>
        </Link>
        <button
          onClick={handleMenuClick}
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
        >
          {isDropdownOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute h-[90vh] top-full left-0 right-0 bg-white shadow-lg py-4 flex flex-col justify-between">
          <div className="w-full flex flex-col justify-center items-center">
            {menuList.map((item) => (
              <Link key={item.name} href={item.link} onClick={handleMenuClick}>
                <button className="w-full text-left text-lg py-2 px-4 hover:bg-gray-100 flex items-center gap-2">
                  {item.icon}
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
          <AuthContextProvider>
            <UserDetailsInMenu />
          </AuthContextProvider>
        </div>
      )}
    </nav>
  );
}
