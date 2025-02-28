// about-us/page.jsx

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Page() {
  return (
    <main>
      <div className="flex justify-center md:flex-row gap-4 bg-[#f8f8f8] p-5 md:px-24 md:py-20 w-full">
        <h2 className="text-gray-500 font-bold text-xs md:text-base">
          ABOUT US
        </h2>
      </div>
      <section className="flex flex-col gap-10 py-10 md:py-20 bg-white min-h-screen">
        <div className="max-w-xl md:max-w-3xl mx-auto px-4 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">About Us</h1>
          <p className="text-base md:text-lg mb-4">
            Welcome to Maktecs, your one-stop-shop for all things.
          </p>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-base md:text-lg mb-4">
            Our mission is to provide high-quality products to meet the needs of
            our customers while ensuring excellent customer service.
          </p>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Our Values</h2>
          <ul className="list-disc list-inside mb-4">
            <li>Customer Satisfaction</li>
            <li>Integrity</li>
            <li>Innovation</li>
            <li>Sustainability</li>
          </ul>
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Our Team</h2>
          <p className="text-base md:text-lg mb-4">
            Our team is composed of experienced professionals dedicated to
            providing the best shopping experience.
          </p>
          <p className="text-base md:text-lg mb-4">
            Thank you for choosing Maktecs. We look forward to
            serving you!
          </p>
        </div>
      </section>
    </main>
  );
}