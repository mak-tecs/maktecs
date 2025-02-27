import {
  getFeaturedProducts,
  getNewArrivals,
  getProducts,
  getTopSellingAndFeaturedProducts,
} from "@/lib/firestore/products/read_server";
import FeaturedProductSlider from "@/app/components/Sliders";
import Collections from "@/app/components/Collections";
import { getCollections } from "@/lib/firestore/collections/read_server";
import Categories from "@/app/components/Categories";
import { getCategories, getCategoriesWithCounts } from "@/lib/firestore/categories/read_server";
import ProductsGridView from "@/app/components/Products";
import CustomerReviews from "@/app/components/CustomerReviews";
import Brands from "@/app/components/Brands";
import { getBrands } from "@/lib/firestore/brands/read_server";
import Footer, { Benefits } from "@/app/components/Footer";
import GeneriConBanner from "@/app/components/GeneriConBanner";
import SmAdvertisements from "@/app/components/SmAdvertisements";
import { getLargeAdvertisements, getSmallAdvertisements } from "@/lib/firestore/advertisement/read_server";
import TopSellers from "@/app/components/TopSellers";
import LgAdvertisements from "@/app/components/LgAdvertisements";
import NewArrivals from "@/app/components/NewArrivals";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [featuredProducts, collections, categories, newArrivals, topSellingAndFeaturedProducts, products, smallAdvertisements, largeAdvertisements] =
    await Promise.all([
      getFeaturedProducts(),
      getCollections(),
      getCategoriesWithCounts(),
      getNewArrivals(),
      getTopSellingAndFeaturedProducts(),
      getProducts(),
      getSmallAdvertisements(),
      getLargeAdvertisements(),
    ]);

  return (
    <>
      <FeaturedProductSlider featuredProducts={featuredProducts} />
      <Collections collections={collections} />
      <SmAdvertisements advertisements={smallAdvertisements} />
      <Categories categories={categories} />
      {/* <TopSellers products={[...topSellingAndFeaturedProducts, ...topSellingAndFeaturedProducts, ...topSellingAndFeaturedProducts, ...topSellingAndFeaturedProducts]} /> */}
      <LgAdvertisements advertisements={largeAdvertisements} />
      {/* <NewArrivals products={newArrivals} /> */}
      <ProductsGridView title="All Products" products={products} />
      {/* <CustomerReviews /> */}
      {/* <Brands brands={brands} /> */}
    </>
  );
}
