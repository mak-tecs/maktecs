"use client";

import { Button } from "@nextui-org/react";
import { ListFilter, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const inputVariants = {
  hidden: { opacity: 0, scale: 0.9 }, // Start hidden and slightly smaller
  visible: { opacity: 1, scale: 1 }, // Fully visible and normal size
};

export default function SearchBox({ toggleDrawer, showFiltersBtn, handleSubmit }) {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  useEffect(() => {
    setQuery(q);
  }, [q]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(query);
      }}
      className="flex w-full justify-center gap-3 items-center"
    >
      <motion.input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if(e.target.value == "") handleSubmit("");
        }}
        placeholder="Search Products..."
        type="text"
        className="border px-5 py-2 rounded-xl bg-white focus:outline-none"
        variants={inputVariants} // Apply animation variants
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      />
      <motion.div
        variants={inputVariants} // Reuse input animation for consistency
        initial="hidden"
        animate="visible"
        className="flex flex-row items-center gap-4"
        transition={{ duration: 0.5 }}
      >
        <Button type="submit">
          <Search size={13} />
          Search
        </Button>
        {
          showFiltersBtn &&
          <ListFilter onClick={()=>{
            toggleDrawer && toggleDrawer()
          }} className="block sm:hidden" size={13} color="red" />
        }
      </motion.div>
    </form>
  );
}
