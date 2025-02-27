"use client";

import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Description";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import {
  createNewProduct,
  updateProduct,
} from "@/lib/firestore/products/write";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/firestore/products/read_server";
import { Trash2 } from "lucide-react";
import { SketchPicker } from "react-color";
import Variants from "./components/Variants";

function Sizes({ sizes, setSizes }) {
  const [newSize, setNewSize] = useState("");

  const addSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl w-full">
      <h1 className="font-semibold">Sizes</h1>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="Add new size"
          className="border px-4 py-2 rounded-lg w-[500px] outline-none"
        />
        <button
          type="button"
          onClick={addSize}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Size
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {sizes.map((size, index) => (
          <li
            key={index}
            className="border px-4 py-1 rounded-lg flex items-center"
          >
            {size}
            <button
              type="button"
              className="ml-2 text-red-500"
              onClick={() => removeSize(size)}
            >
              <Trash2 />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Colors({ colors, setColors }) {
  const [newColor, setNewColor] = useState("#ffffff");
  const [showPicker, setShowPicker] = useState(false);

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
      setNewColor("#ffffff");
    }
  };

  const handleColorChange = (color) => {
    setNewColor(color.hex);
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl w-full relative">
      <h1 className="font-semibold">Colors</h1>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Add new color"
          className="border px-4 py-2 rounded-lg w-[500px] outline-none"
        />
        <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {showPicker ? "Close Picker" : "Open Picker"}
        </button>
        {showPicker && (
        <div className="absolute z-10 mt-2" style={{ top: "100%" }}>
          <SketchPicker
            color={newColor}
            onChange={handleColorChange}
            disableAlpha
          />
        </div>
      )}
        </div>
        <button
          type="button"
          onClick={addColor}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Add Color
        </button>
      </div>
      <ul className="flex flex-wrap gap-2 mt-2">
        {colors.map((color, index) => (
          <li
            key={index}
            className="border px-4 py-1 rounded-lg flex items-center"
          >
            <div style={{ background: color }} className="w-5 aspect-square mr-2"></div>
            {color}
            <button
              type="button"
              className="ml-2 text-red-500"
              onClick={() => removeColor(color)}
            >
              <Trash2 />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Page() {
  const [data, setData] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [variants, setVariants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();

  const router = useRouter();

  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getProduct({ id: id });
      if (!res) {
        throw new Error("Product Not Found");
      } else {
        setData(res);
        setImageList(res?.imageList || []);
        setColors(res?.colors || [])
        setSizes(res?.sizes || [])
        setVariants(res?.variants || [])
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => {
      return {
        ...(prevData ?? {}),
        [key]: value,
      };
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewProduct({
        data: data,
        featureImage: featureImage,
        imageList: imageList,
        colors: colors,
        sizes: sizes,
        variants: variants
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      setSizes([]);
      setColors([]);
      setVariants([]);
      toast.success("Product is successfully Created!");
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProduct({
        data: data,
        featureImage: featureImage,
        imageList: imageList,
        colors: colors,
        sizes: sizes,
        variants: variants
      });
      setData(null);
      setFeatureImage(null);
      setImageList([]);
      toast.success("Product is successfully Updated!");
      router.push(`/admin/products`);
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (id) {
          handleUpdate();
        } else {
          handleCreate();
        }
      }}
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex justify-between w-full items-center">
        <h1 className="font-semibold">
          {id ? "Update Product" : "Create New Product"}
        </h1>
        <Button isLoading={isLoading} isDisabled={isLoading} type="submit">
          {id ? "Update" : "Create"}
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex">
          <BasicDetails data={data} handleData={handleData} />
        </div>
        <div className="flex-1 flex flex-col gap-5 h-full">
          <Images
            data={data}
            featureImage={featureImage}
            setFeatureImage={setFeatureImage}
            imageList={imageList}
            setImageList={setImageList}
          />
          <Description data={data} handleData={handleData} />
        </div>
      </div>

      {/* <Sizes sizes={sizes} setSizes={setSizes} /> */}
      {/* <Colors colors={colors} setColors={setColors} /> */}
      <Variants
        sizes={sizes}
        setSizes={setSizes}
        colors={colors}
        setColors={setColors}
        variants={variants}
        setVariants={setVariants}
      />
    </form>
  );
}
