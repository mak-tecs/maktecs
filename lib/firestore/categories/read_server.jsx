import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export const getCategory = async ({ id }) => {
  const data = await getDoc(doc(db, `categories/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

export const getCategories = async () => {
  const list = await getDocs(collection(db, "categories"));
  return list.docs.map((snap) => snap.data());
};

export const getCategoriesWithCounts = async () => {
  const categoryDocs = await getDocs(collection(db, "categories"));
  const categories = categoryDocs.docs.map((snap) => snap.data());

  // Assuming products have a field `categoryId`
  const productCollectionRef = collection(db, "products");

  // Map to maintain product count per category
  const categoryProductCount = {};

  for (const category of categories) {
    // Query products for each category
    const productsQuery = query(productCollectionRef, where("categoryId", "==", category.id));
    const productsSnapshot = await getDocs(productsQuery);
    categoryProductCount[category.id] = productsSnapshot.size;
  }

  return categories.map((category) => ({
    ...category,
    productCount: categoryProductCount[category.id] || 0,
  }));
};

