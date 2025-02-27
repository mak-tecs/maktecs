"use state";

import { Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { SketchPicker } from "react-color";

export default function Variants({
  sizes,
  setSizes,
  colors,
  setColors,
  variants,
  setVariants,
}) {
  const [newVariant, setNewVariant] = useState({
    size: "",
    color: { name: "", code: ""},
    stock: "",
    price: "",
    salePrice: "",
    image: null,
  });
  const [newColor, setNewColor] = useState({
    name: "",
    code: "gray"
  });
  const [showPicker, setShowPicker] = useState(false);
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

  const addColor = () => {
    if (newColor.name && newColor.code && !colors.find(color => color.name == newColor.name)) {
      setColors([...colors, newColor]);
      setNewColor({
        name: "",
        code: "gray"
      });
    }
  };

  const handleColorChange = (color) => {
    setNewColor(newColor=>({
      ...newColor,
      code: color.hex
    }));
  };

  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color.name !== colorToRemove.name));
  };

  const handleAddVariant = () => {
    setVariants([...variants, newVariant]);
    setNewVariant({
      size: "",
      color: { name: "", code: ""},
      stock: "",
      price: "",
      salePrice: "",
      image: null,
    });
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleChange = (index, key, value) => {
    const updatedVariants = variants.map((variant, idx) =>
      idx === index ? { ...variant, [key]: value } : variant
    );
    setVariants(updatedVariants);
  };

  const handleImageUpload = (index, file) => {
    const updatedVariants = variants.map((variant, idx) =>
      idx === index ? { ...variant, image: file } : variant
    );
    setVariants(updatedVariants);
  };

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl w-full">
      <h1 className="font-semibold">Product Varients</h1>

      <label className="text-gray-500 text-xs">Sizes:</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="Add new size"
          className="border px-4 py-2 rounded-lg w-[500px] outline-none"
        />
        <div className="flex items-center gap-2">
          <Button type="button" onClick={addSize}>
            Add Size
          </Button>
        </div>
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

      <label className="text-gray-500 text-xs">Colors:</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={newColor?.name}
          onChange={(e) => setNewColor(newColor => ({
            ...newColor,
            name: e.target?.value?.trim()?.toLowerCase()
          }))}
          placeholder="Add new color"
          className="border px-4 py-2 rounded-lg w-[500px] outline-none"
        />
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Button
              type="button"
              className={`min-h-full max-w-10 w-10 min-w-10`}
              style={{
                backgroundColor: newColor.code
              }}
              onClick={() => setShowPicker((prev) => !prev)}
            >
              {/* {showPicker ? "Close Picker" : "Open Picker"} */}
            </Button>
            {showPicker && (
              <div className="absolute z-10 mt-2" style={{ top: "100%" }}>
                <SketchPicker
                  color={newColor.code}
                  onChange={handleColorChange}
                  disableAlpha
                />
              </div>
            )}
          </div>
          <Button type="button" onClick={addColor}>
            Add Color
          </Button>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 mt-2">
        {colors.map((color, index) => (
          <li
            key={index}
            className="border px-4 py-1 rounded-lg flex items-center"
          >
            <div
              style={{ background: color.code }}
              className="w-5 aspect-square mr-2"
            ></div>
            {color.name}
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

      <h1 className="text-gray-500 text-xs">Variants:</h1>
      {variants.map((variant, index) => (
        <div key={index} className="flex flex-col gap-4 border rounded-lg p-2">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <select
                onChange={(e) => handleChange(index, "size", e.target.value)}
                value={variant.size}
                className="border px-2 py-1 rounded-lg"
              >
                <option value="">Select Size</option>
                {sizes.map((size, idx) => (
                  <option key={idx} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => handleChange(index, "color", JSON.parse(e.target.value))}
                value={JSON.stringify(variant.color)}
                className="border px-2 py-1 rounded-lg"
              >
                <option value={JSON.stringify({name: "", code: ""})}>Select Color</option>
                {colors.map((color, idx) => (
                  <option key={idx} value={JSON.stringify(color)}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
            <div onClick={() => handleRemoveVariant(index)}>
              <Trash2 />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs" htmlFor="product-title">
                Stock <span className="text-red-500">*</span>{" "}
              </label>
              <input
                type="number"
                placeholder="Stock"
                value={variant.stock}
                onChange={(e) => handleChange(index, "stock", e.target.value)}
                className="border px-2 py-1 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs" htmlFor="product-title">
                Price <span className="text-red-500">*</span>{" "}
              </label>
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
                className="border px-2 py-1 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-500 text-xs" htmlFor="product-title">
                Sale Price <span className="text-red-500">*</span>{" "}
              </label>
              <input
                type="number"
                placeholder="Sale Price"
                value={variant.salePrice}
                onChange={(e) =>
                  handleChange(index, "salePrice", e.target.value)
                }
                className="border px-2 py-1 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-500 text-xs">
                Image: <span className="text-red-500">*</span>{" "}
              </label>
              <input
                type="file"
                multiple={false}
                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                className="border px-2 py-1 rounded-lg"
              />
            </div>
            {variant.image && (
              <div className="flex justify-center">
                <img
                  className="h-20 object-cover rounded-lg"
                  src={typeof variant.image == "string" ? variant.image : URL.createObjectURL(variant.image)}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        onClick={handleAddVariant}
        className="mt-2 py-2 px-4 rounded-lg"
      >
        Add Variant
      </Button>
    </section>
  );
}
