"use client"
import Link from "next/link";

export default function Page() {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const message = form.elements.message.value;

    const subject = `Message from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
    
    window.location.href = `mailto:maktecs.com@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    
  
  }

  return (
    <main>
      <div className="flex justify-center md:flex-row gap-4 bg-[#f8f8f8] p-5 md:px-24 md:py-20 w-full">
        <h2 className="text-gray-500 font-bold text-xs md:text-base">CONTACT US</h2>
      </div>
      <section className="flex flex-col items-center gap-10 py-[50px] md:py-[100px] bg-white min-h-screen">
        <div className="w-full max-w-xl md:max-w-3xl px-4 md:px-0 mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-base md:text-lg mb-4">
            We'd love to hear from you. Reach out to us using the contact
            information below or fill out the form.
          </p>
        </div>
        <div className="w-full max-w-xl md:max-w-3xl px-4 md:px-0 mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Contact Information</h2>
          <p>
            <strong>Email:</strong> maktecs.com@gmail.com
          </p>
          <p>
            <strong>Phone:</strong> +92 344 5569902
          </p>
          <p>
            <strong>Address:</strong> Gulberg colony main GT road wah cantt
          </p>
        </div>
        <div className="w-full max-w-xl md:max-w-3xl px-4 md:px-0 mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">Send Us a Message</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col">
              <span>Name</span>
              <input
                type="text"
                name="name"
                className="border p-2 rounded-md"
                placeholder="Your Name"
              />
            </label>
            <label className="flex flex-col">
              <span>Email</span>
              <input
                type="email"
                name="email"
                className="border p-2 rounded-md"
                placeholder="Your Email"
              />
            </label>
            <label className="flex flex-col">
              <span>Message</span>
              <textarea
                name="message"
                className="border p-2 rounded-md"
                rows="4"
                placeholder="Your Message"
              ></textarea>
            </label>
            <button
              type="submit"
              className="flex-1 bg-gray-700 text-white p-4 rounded-lg text-medium w-full">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}