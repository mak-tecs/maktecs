"use client"

import { Rating } from "@mui/material";
import { motion } from "framer-motion";
import { useAllReview } from "@/lib/firestore/reviews/read";


export default function CustomerReviews() {
  debugger;
  const { data: reviews } = useAllReview();
  console.log(reviews, "dataa")


  const list = [
    {
      name: "Penny albritoon",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      rating: 4.5,
      imageLink:
        "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-1.jpg?v=1721992196&width=512",
    },
    {
      name: "Oscar Nommanee",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      rating: 5,
      imageLink:
        "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-5.jpg?v=1721992196&width=512",
    },
    {
      name: "Emma Watsom",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
      rating: 4.5,
      imageLink:
        "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-6.jpg?v=1721992197&width=512",
    },
  ];

  // Define animation variants
  const reviewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="flex justify-center">
      <div className="w-full p-5 md:max-w-[900px] flex flex-col gap-3">
        <motion.h1
          className="text-center mb-5 text-4xl uppercase"
          variants={headingVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          Our customers love
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {list.map((item, index) => (
            <motion.div
              className="flex flex-col gap-2 p-4 rounded-lg justify-center items-center border"
              key={item.name}
              variants={reviewVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                src={item.imageLink}
                className="h-32 w-32 rounded-full object-cover"
                alt={item.name}
              />
              <h1 className="!text-xl">{item.name}</h1>
              <Rating
                size="small"
                name="customer-rating"
                defaultValue={item.rating}
                precision={0.5}
                readOnly
              />
              <p className="text-sm text-gray-500 text-center">
                {item.message}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}