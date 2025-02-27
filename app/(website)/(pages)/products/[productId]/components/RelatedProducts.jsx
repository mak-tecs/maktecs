import ProductsGridView, { ProductCard } from "@/app/components/Products";
import { getProductsByCategory } from "@/lib/firestore/products/read_server";

export default async function RelatedProducts({ categoryId }) {
  const products = await getProductsByCategory({ categoryId: categoryId });
  return (
    <ProductsGridView title="Relative Products" showSearchBar={false} products={products}/>
  );
}
