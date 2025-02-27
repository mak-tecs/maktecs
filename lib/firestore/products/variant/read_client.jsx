"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useColorsInVariants() {
  const [colorsMap, setColorsMap] = useState({});

  useEffect(() => {
    const productsRef = collection(db, "products");

    const unsub = onSnapshot(productsRef, (snapshot) => {
      let tempColorsMap = {};

      snapshot.forEach((doc) => {
        const product = doc.data();

        if (product.variants && Array.isArray(product.variants)) {
          product.variants.forEach((variant) => {
            const colorName = variant.color?.name ?? "";
            const colorCode = variant.color?.code ?? "";

            if (colorName) {
              // Initialize if not already in map
              if (!tempColorsMap[colorName]) {
                tempColorsMap[colorName] = new Set();
              }

              // Add colorCode
              if (colorCode) {
                tempColorsMap[colorName].add(colorCode);
              }
            }
          });
        }
      });

      // Convert Set to Array for each color
      const finalColorsMap = {};
      for (let [colorName, colorSet] of Object.entries(tempColorsMap)) {
        finalColorsMap[colorName] = Array.from(colorSet);
      }

      setColorsMap(finalColorsMap);
    });

    return () => unsub();
  }, []);

  return colorsMap;
}
