import { Plus, Trash2 } from "lucide-react";

export default function Images({
  data,
  setFeatureImage,
  featureImage,
  imageList,
  setImageList,
}) {
  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e) => {
      const newFiles = [];
      for (let i = 0; i < e.target.files.length; i++) {
        newFiles.push(e.target.files[i]);
      }
      setImageList((files) => [...files, ...newFiles]);
    };
    input.click();
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageList((prevImageList) =>
      prevImageList.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl">
      <h1 className="font-semibold">Images</h1>
      <div className="flex flex-col gap-1">
        {data?.featureImageURL && !featureImage && (
          <div className="flex justify-center">
            <img
              className="h-20 object-cover rounded-lg"
              src={data?.featureImageURL}
              alt=""
            />
          </div>
        )}
        {featureImage && (
          <div className="flex justify-center">
            <img
              className="h-20 object-cover rounded-lg"
              src={URL.createObjectURL(featureImage)}
              alt=""
            />
          </div>
        )}
        <label
          className="text-gray-500 text-xs"
          htmlFor="product-feature-image"
        >
          Feature Image <span className="text-red-500">*</span>{" "}
        </label>
        <input
          type="file"
          id="product-feature-image"
          name="product-feature-image"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              setFeatureImage(e.target.files[0]);
            }
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-images">
          Images <span className="text-red-500">*</span>{" "}
        </label>
        <div className="flex items-center flex-wrap gap-3">
          {imageList.map((item, index) => (
            <div className="relative inline-block m-2" key={index}>
              <img
                className="w-20 h-20 object-cover rounded-lg"
                src={typeof item == "string" ? item : URL.createObjectURL(item)}
                alt=""
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-20 text-red-600 rounded-full cursor-pointer opacity-0 hover:opacity-100"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 />
              </div>
            </div>
          ))}
          <div
            onClick={handleAddImage}
            className="flex justify-center items-center w-20 h-20 border-2 border-black border-dashed rounded-lg"
          >
            <Plus />
          </div>
        </div>
        {/* <input
            type="file"
            id="product-images"
            name="product-images"
            multiple
            onChange={(e) => {
              const newFiles = [];
              for (let i = 0; i < e.target.files.length; i++) {
                newFiles.push(e.target.files[i]);
              }
              setImageList(newFiles);
            }}
            className="border px-4 py-2 rounded-lg w-full outline-none"
          /> */}
      </div>
    </section>
  );
}
