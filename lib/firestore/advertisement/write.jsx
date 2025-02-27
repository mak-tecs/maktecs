import { db, storage } from "@/lib/firebase";
import { uploadFile } from "@/lib/vercel.blob";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  Timestamp, 
  increment
} from "firebase/firestore";

export const createAdvertisement = async ({ data, addImage }) => {
  if (!addImage) {
    throw new Error("Image is Required");
  }
  if (!data?.link) {
    throw new Error("Link is required");
  }
  if (!data?.size) {
    throw new Error("Size is required");
  }

  const newId = doc(collection(db, `ids`)).id;

  const imageURL = await uploadFile(`advertisements/${newId}`, addImage);

  await setDoc(doc(db, `advertisements/${newId}`), {
    ...data,
    id: newId,
    addImage: imageURL,
    clicks: 0,
    active: true,
    timestampCreate: Timestamp.now(),
  });
};

export const updateAdvertisement = async ({ data, addImage }) => {
  if (!data?.link) {
    throw new Error("Link is required");
  }
  if (!data?.size) {
    throw new Error("Size is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }
  const id = data.id;

  let imageURL = data.addImage;

  if (addImage) {
    imageURL = await uploadFile(`advertisements/${id}`, addImage);
  }

  await updateDoc(doc(db, `advertisements/${id}`), {
    ...data,
    addImage: imageURL,
    timestampUpdate: Timestamp.now(),
  });
};

export const updateAdvertisementClicks = async (id) => {
  if (!id) {
    throw new Error("ID is required");
  }
  try {
    await updateDoc(doc(db, `advertisements/${id}`), {
      clicks: increment(1),
    });
  } catch (error) {
    console.error("Error updating click count: ", error);
  }
};


export const deleteAdvertisement = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `advertisements/${id}`));
};