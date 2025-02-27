import { getCategory } from "@/lib/firestore/categories/read_server";
import Link from "next/link";

export default async function Category({ categoryId }) {
  const category = await getCategory({ id: categoryId });
  
  return (
    <Link href={`/categories/${categoryId}`}>
      <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
        <img className="h-4" src={category?.imageURL} alt="" />
        <h4 className="text-xs font-semibold">{category?.name}</h4>
      </div>
    </Link>
  );
}