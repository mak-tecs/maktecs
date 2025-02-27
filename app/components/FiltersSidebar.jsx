"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Filter, ListFilter, X } from "lucide-react";
import { getCategoriesWithCounts } from "@/lib/firestore/categories/read_server";
import { useColorsInVariants } from "@/lib/firestore/products/variant/read_client";

const FiltersSidebar = ({position="left"}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const colorsMap = useColorsInVariants(); // Use the hook to get colors

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categories = await getCategoriesWithCounts();
        console.log({ categories });
        setCategories(categories || []);
      } catch (error) {
        console.log({
          categories: error,
        });
      }
    };
    getCategories();
  }, []);

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    producttype: true,
    brand: true,
    price: true,
    color: true,
  });

  const getSelectedValues = (name) => {
    return searchParams?.getAll(name) || [];
  };

  const handleFilterChange = (newFilters, options = {}) => {
    const newQueryString = createQueryString(newFilters, options);
    router.push(`?${newQueryString}`, { scroll: false })
  };

  const ExpandedSection = ({ section }) => {
    switch (section) {
      case "categories":
        return (
          <div className="mt-2 space-y-2">
            {categories?.map((category) => (
              <label
                key={category.name}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={getSelectedValues("category").includes(
                      category.id
                    )}
                    onChange={() =>
                      handleFilterChange([{name: "category", value: category.id}])
                    }
                    className="mr-2"
                  />
                  {category.name}
                </div>
                <span className="text-gray-500 text-sm">
                  {category.productCount}
                </span>
              </label>
            ))}
          </div>
        );
      case "producttype":
        // Example list, replace with actual data
        const productTypes = [
          "Featured", 
          // "Best Selling", 
          // "New Arrivals"
        ];
        return (
          <div className="mt-2 space-y-2">
            {productTypes.map((type) => (
              <label
                key={type}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={getSelectedValues("producttype").includes(type)}
                    onChange={() => handleFilterChange([{name: "producttype", value: type}])}
                    className="mr-2"
                  />
                  {type}
                </div>
              </label>
            ))}
          </div>
        );
      case "brand":
        // Example list, replace with actual data
        const brands = ["Brand1", "Brand2"];
        return (
          <div className="mt-2 space-y-2">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={getSelectedValues("brand").includes(brand)}
                    onChange={() => handleFilterChange([{name: "brand", value: brand}])}
                    className="mr-2"
                  />
                  {brand}
                </div>
              </label>
            ))}
          </div>
        );
      case "price":
        const minPrice = getSelectedValues("min_price")[0] || "";
        const maxPrice = getSelectedValues("max_price")[0] || "";

        return (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                defaultValue={minPrice}
                type="number"
                name="min_price"
                placeholder="Min"
                onChange={(e)=>{
                  handleFilterChange([
                    { name: "min_price", value: e.target.value},
                  ], {
                    oneOnly: true
                  });
                }}
                className="border p-1 w-20 rounded"
              />
              <span>-</span>
              <input
                defaultValue={maxPrice}
                type="number"
                name="max_price"
                placeholder="Max"
                onChange={(e)=>{
                  handleFilterChange([
                    { name: "max_price", value: e.target.value},
                  ], {
                    oneOnly: true
                  });
                }}
                className="border p-1 w-20 rounded"
              />
            </div>
          </div>
        );
      case "color":
        return (
          <div className="mt-2 space-y-2">
            {Object.keys(colorsMap || {}).map((colorName) => (
              <label
                key={colorName}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={getSelectedValues("color").includes(colorName)}
                    onChange={() => handleFilterChange([{name: "color", value: colorName}])}
                    className="mr-2"
                  />
                  {colorName}
                </div>
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const createQueryString = (newFilters, options = {}) => {
    let newParam;
    for (const filter of newFilters) {
      const {name, value} = filter
      const params = new URLSearchParams(searchParams.toString());

      if (options.oneOnly) {
        params.delete(name);
      }
  
      const currentValues = options.oneOnly ? [] : params.getAll(name);
    
      if (currentValues.includes(value)) {
        const newValues = currentValues.filter((v) => v !== value);
        params.delete(name);
        newValues.forEach((v) => params.append(name, v));
      } else {
        params.append(name, value);
      }
  
      newParam =  params.toString();
    }

    return newParam;
  };

  const clearAllFilters = () => {
    const searchQuery = searchParams.get("q");
    const newParams = new URLSearchParams();

    if (searchQuery) {
      newParams.set("q", searchQuery);
    }

    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const hasActiveFilters = () => {
    const params = new URLSearchParams(searchParams);

    // Filter out the 'q' query parameter and check if there's any other parameter remaining
    for (const [key] of params) {
      if (key !== "q") {
        return true; // There's at least one filter other than 'q'
      }
    }
    return false; // No filters other than 'q'
  };

  // Usage
  const isAnyFilterActive = hasActiveFilters();

  return (
    <div className={`${position == "left" && "w-64 border-r p-4"} ${position == "bottom" && "w-full p-10"} bg-white`}>
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold flex gap-2">
          <ListFilter color="red" />
          Filter By:
        </h2>
        {isAnyFilterActive && (
          <button
            onClick={clearAllFilters}
            className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Other filter sections */}
        {["Categories", "Product Type", "Price",].map(
          (section) => (
            <div key={section}>
              <button
                onClick={() =>
                  toggleSection(section.toLowerCase().replace(" ", ""))
                }
                className="flex justify-between items-center w-full py-2 text-left font-medium"
              >
                {section}
                {expandedSections[section.toLowerCase().replace(" ", "")] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              {expandedSections[section.toLowerCase().replace(" ", "")] && (
                <ExpandedSection
                  section={section.toLowerCase().replace(" ", "")}
                />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FiltersSidebar;
