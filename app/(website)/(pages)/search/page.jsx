"use client"
import FiltersSidebar from "@/app/components/FiltersSidebar";
import ProductsGridView from "@/app/components/Products";
import { searchAndFilterProducts } from "@/lib/firestore/products/read_server";
import { Drawer } from "@mui/material";
import { CircularProgress } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

function SearchPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams().toString());

  const [products, setProducts] = useState([]);
  const [drawer, setDrawer] = useState(false);

  // Derive 'params' based on current searchParams
  const params = useMemo(() => {
    const _params = {};
    searchParams.forEach((value, key) => {
      if (_params[key]) {
        if (Array.isArray(_params[key])) {
          _params[key].push(value);
        } else {
          _params[key] = [_params[key], value];
        }
      } else {
        _params[key] = value;
      }
    });
    return _params;
  }, [searchParams.toString()]);

  useEffect(() => {
    async function fetchProducts(params) {
      const products = await searchAndFilterProducts(params || {});
      setProducts(products);
    }
    fetchProducts(params);
  }, [params]); // Ensure 'params' is a dependency here

  const handleSearch = useCallback(
    (query) => {
      searchParams.set("q", query);
      router.push(`/search?${searchParams.toString()}`);
    },
    [searchParams, router]
  );

  function toggleDrawer() {
    setDrawer((state) => !state);
  }

  return (
    <main className="flex relative min-h-[calc(100vh-100px)]">
      <Drawer anchor="bottom" open={drawer} onClose={toggleDrawer}>
        <FiltersSidebar position="bottom" />
      </Drawer>
      <div className="hidden sm:block">
        <FiltersSidebar position="left" />
      </div>
      <div className="flex-1">
        <ProductsGridView
          toggleDrawer={toggleDrawer}
          showFiltersBtn={true}
          products={products}
          handleSearch={handleSearch}
        />
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div><CircularProgress /></div>}>
      <SearchPage />
    </Suspense>
  );
}