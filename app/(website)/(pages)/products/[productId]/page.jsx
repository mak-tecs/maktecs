import { getProduct } from "@/lib/firestore/products/read_server";
import Photos from "./components/Photos";
import Reviews from "./components/Reviews";
import RelatedProducts from "./components/RelatedProducts";
import AddReview from "./components/AddReiveiw";
import AuthContextProvider from "@/contexts/AuthContext";
import Intro from "./components/Intro";
import Details from "./components/Details";
import Benefits from "./components/Benefits";
import ImageGallery from "./components/ImageGallery";

export async function generateMetadata({ params }) {
  const { productId } = params;
  const product = await getProduct({ id: productId });

  return {
    title: `${product?.title} | Product`,
    description: product?.shortDescription ?? "",
    openGraph: {
      images: [product?.featureImageURL],
    },
  };
}

export default async function Page({ params }) {
  const { productId } = params;

  let product;
  product= await getProduct({ id: productId });
  product = {
    ...product,
    timestampCreate: new Date(product.timestampCreate?.seconds * 1000).toISOString(),
  };

  return (
    <main className="p-5 md:p-10">
      <section className="flex flex-col lg:flex-row gap-3">
        <Photos
          imageList={[product?.featureImageURL, ...(product?.imageList ?? [])]}
        />
        <Intro product={product} />
        <Benefits/>
      </section>

      <div className="my-10">
        <ImageGallery images={[product?.featureImageURL, ...(product?.imageList ?? [])]} />
      </div>

      <div className="flex justify-center py-4 lg:py-10">
        <Details product={product} />
      </div>
      <div className="flex justify-center py-10">
        <AuthContextProvider>
          <div className="flex flex-col lg:flex-row gap-4 lg:max-w-[900px] w-full">
            <AddReview productId={productId} />
            <Reviews productId={productId} />
          </div>
        </AuthContextProvider>
      </div>
      <RelatedProducts categoryId={product?.categoryId} />
    </main>
  );
}
