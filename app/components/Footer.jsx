import { Mail, MapPin, Phone, Truck, Gift, Headset } from "lucide-react";
import { SocialIcon } from "react-social-icons";


export function Benefits() {
  return (
    <div className="bg-gray-100 mt-7">
      <div className="max-w-[1000px] mx-auto py-4">
        <div className="flex flex-col md:flex-row justify-between text-center md:text-left space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center md:w-1/3 space-x-3 justify-center md:justify-start">
            <Truck size={35} />
            <div>
              <h3 className="text-lg">FREE SHIPPING</h3>
              <p className="text-sm">all over Pakistan (conditions apply)</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:w-1/3 space-x-3 justify-center">
            <Gift size={37} />
            <div>
              <h3 className="text-lg">BRAND NEW, FACTORY SEALED</h3>
              <p className="text-sm">100% original genuine products only</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:w-1/3 space-x-3 justify-center">
            <Headset size={37} />
            <div>
              <h3 className="text-lg">SUPPORT</h3>
              <p className="text-sm">comprehensive service &amp; support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <>
    <Benefits/>
    <footer className="flex flex-col gap-3 w-full bg-blue-100 border-t p-5 md:p-10">
      <div className="border-b w-full flex flex-col md:flex-row md:justify-between gap-3">
        <div className="flex">
          <img className="h-8" src="/logos/Horizontal.svg" alt="Logo" />
        </div>
        <div className="flex-1 flex flex-col md:flex-row justify-end gap-4">
          <div className="flex gap-2 items-center">
            <Phone size={12} className="text-blue-500" />
            <h2 className="text-sm text-gray-600">+92 344 5569902</h2>
          </div>
          <div className="flex gap-2 items-center">
            <Mail size={12} className="text-blue-500" />
            <h2 className="text-sm text-gray-600">maktecs.com@gmail.com</h2>
          </div>
          <div className="flex gap-2 items-center">
            <MapPin size={12} className="text-blue-500" />
            <h2 className="text-sm text-gray-600">Wah Cantt</h2>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full mt-5">
        <h3 className="text-xs text-gray-700 uppercase font-semibold">
          Follow us for more updates
        </h3>
      </div>
      <div className="flex justify-center w-full space-x-4 mb-5">
        <SocialIcon url="https://www.facebook.com/share/1BLbZ6JzF5/" />
        <SocialIcon url="https://www.instagram.com/maktecs?igsh=MWo4bDBweXQ1Y3FuNw==" />
        <SocialIcon url="https://www.tiktok.com/@mak.tecs?_t=ZS-8u6DEhhp0Hn&_r=1" />{" "}
      </div>
      <div className="flex justify-center w-full">
        <h3 className="text-xs text-gray-700">
          © 2024 . All rights reserved by MAK-TECS
        </h3>
      </div>
    </footer>
    </>
  );
}
