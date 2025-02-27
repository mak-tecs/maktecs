export default function Details({ product }) {
  return (
    <div className="flex flex-col gap-4 md:max-w-[900px] w-full">
      <h1 className="text-lg font-semibold">Product Details</h1>
      <div
        className="text-gray-600"
        dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}
      ></div>
    </div>
  );
}
