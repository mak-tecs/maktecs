import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  where,
  query,
} from "firebase/firestore";
import Fuse from "fuse.js";

export const getProduct = async ({ id }) => {
  const data = await getDoc(doc(db, `products/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

export const getFeaturedProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), where("isFeatured", "==", true))
  );
  return list.docs.map((snap) => snap.data());
};

export const getProducts = async () => {
  const list = await getDocs(
    query(collection(db, "products"), orderBy("timestampCreate", "desc"))
  );
  return list.docs.map((snap) => snap.data());
};

export const getNewArrivals = async () => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      limit(10)
    )
  );
  return list.docs.map((snap) => snap.data());
};

export const getTopSellingAndFeaturedProducts = async () => {
  // Step 1: Get all orders to determine top-selling products
  const ordersSnapshot = await getDocs(collection(db, "orders"));
  const productCountMap = {};

  // Step 2: Aggregate product counts from orders
  ordersSnapshot.forEach((orderDoc) => {
    const orderData = orderDoc.data();
    const productIds = orderData.productIds || [];

    productIds.forEach((productId) => {
      if (!productCountMap[productId]) {
        productCountMap[productId] = 0;
      }
      productCountMap[productId] += 1;
    });
  });

  // Step 3: Sort products by count of orders
  const sortedProductIds = Object.keys(productCountMap).sort(
    (a, b) => productCountMap[b] - productCountMap[a]
  );

  // Step 4: Fetch details of top-selling products (limit to, e.g., 10)
  const topSelling = [];
  for (const productId of sortedProductIds.slice(0, 10)) {
    const productSnapshot = await getDoc(doc(db, `products/${productId}`));
    if (productSnapshot.exists()) {
      topSelling.push(productSnapshot.data());
    }
  }

  // Fetch featured products
  const featuredProducts = await getFeaturedProducts();

  // Concatenate top-selling and featured products
  const combinedProducts = [...featuredProducts, ...topSelling];

  return combinedProducts;
};

export const getProductsByCategory = async ({ categoryId }) => {
  const list = await getDocs(
    query(
      collection(db, "products"),
      orderBy("timestampCreate", "desc"),
      where("categoryId", "==", categoryId)
    )
  );
  return list.docs.map((snap) => snap.data());
};

export const searchAndFilterProducts = async (params) => {
  const productsRef = collection(db, "products");
  let q = query(productsRef);

  if (params.category && params.category.length > 0) {
    q = query(q, where("categoryId", "in", Array.isArray(params.category) ? params.category : [params.category]));
  }

  if (params.producttype && params.producttype.includes("Featured")) {
    q = query(q, where("isFeatured", "==", true));
  }

  if (params.min_price) {
    q = query(q, where("salePrice", ">=", Number(params.min_price)));
  }
  if (params.max_price) {
    q = query(q, where("salePrice", "<=", Number(params.max_price)));
  }

  if (params.color && params.color.length > 0) {
    q = query(
      q,
      where("variants.color.name", "array-contains-any", Array.isArray(params.color) ? params.color : [params.color])
    );
  }

  const querySnapshot = await getDocs(q);
  var products = querySnapshot.docs.map((doc) => doc.data());

  if (params.q) {
    const options = {
      keys: ["title", "shortDescription"],
      threshold: 0.3,
    };
    const fuse = new Fuse(products, options);
    products = fuse.search(params.q).map((result) => result.item);
  }

  return products;
};
