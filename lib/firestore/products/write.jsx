import { db, storage } from "@/lib/firebase";
import { uploadFile } from "@/lib/vercel.blob";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createNewProduct = async ({ data, featureImage, imageList, sizes, colors, variants }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!featureImage) {
    throw new Error("Feature Image is required");
  }
  // const featureImageRef = ref(storage, `products/${featureImage?.name}`);
  // await uploadBytes(featureImageRef, featureImage);
  // const featureImageURL = await getDownloadURL(featureImageRef);

  const featureImageURL = await uploadFile(`products/${featureImage?.name}`, featureImage);


  const imageURLList = await Promise.all(imageList.map(async (image) => {
    if (typeof image === 'string') {
      return image;
    }
    return await uploadFile(`products/${image?.name}`, image);
  }));

  const variantData = await Promise.all(variants.map(async (variant) => {
    let image = variant.image;
    let imageURL = typeof image === 'string' ? image : await uploadFile(`products/variants/${image?.name}`, image);

    return {
      ...variant,
      image: imageURL,
    };
  }));

  const newId = doc(collection(db, `ids`)).id;

  await setDoc(doc(db, `products/${newId}`), {
    ...data,
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    sizes,
    colors,
    variants: variantData,
    id: newId,
    timestampCreate: Timestamp.now(),
  });
};

export const updateProduct = async ({ data, featureImage, imageList, sizes, colors, variants }) => {
  if (!data?.title) {
    throw new Error("Title is required");
  }
  if (!data?.id) {
    throw new Error("ID is required");
  }

  let featureImageURL = data?.featureImageURL ?? "";

  if (featureImage) {
    // const featureImageRef = ref(storage, `products/${featureImage?.name}`);
    // await uploadBytes(featureImageRef, featureImage);
    // featureImageURL = await getDownloadURL(featureImageRef);

    featureImageURL = await uploadFile(`products/${featureImage?.name}`, featureImage);
  }

  const imageURLList = imageList?.length === 0 ? data?.imageList : await Promise.all(imageList.map(async (image) => {
    if (typeof image === 'string') {
      return image;
    }
    return await uploadFile(`products/${image?.name}`, image);
  }));

  const variantData = await Promise.all(variants.map(async (variant) => {
    let image = variant.image;
    let imageURL = typeof image === 'string' ? image : await uploadFile(`products/variants/${image?.name}`, image);

    return {
      ...variant,
      image: imageURL,
    };
  }));

  await setDoc(doc(db, `products/${data?.id}`), {
    ...data,
    featureImageURL: featureImageURL,
    imageList: imageURLList,
    sizes,
    colors,
    variants: variantData,
    timestampUpdate: Timestamp.now(),
  });
};

export const deleteProduct = async ({ id }) => {
  if (!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(db, `products/${id}`));
};
