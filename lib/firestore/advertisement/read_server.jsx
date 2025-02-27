import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getAdvertisement = async ({ id }) => {
  const data = await getDoc(doc(db, `advertisements/${id}`));
  if (data.exists()) {
    return data.data();
  } else {
    return null;
  }
};

export const getSmallAdvertisements = async () => {
  const list = await getDocs(collection(db, "advertisements"));
  return list.docs
    .map((snap) => snap.data())
    .filter((ad) => ad.size === "sm" && ad.active); // Ensure only active small ads are retrieved
};

export const getLargeAdvertisements = async () => {
  const list = await getDocs(collection(db, "advertisements"));
  return list.docs
    .map((snap) => snap.data())
    .filter((ad) => ad.size === "lg" && ad.active); // Ensure only active small ads are retrieved
};

export const getAdvertisements = async () => {
  const list = await getDocs(collection(db, "advertisements"));
  return list.docs.map((snap) => snap.data());
};