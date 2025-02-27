import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const createUser = async ({ uid, displayName, photoURL }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      displayName: displayName,
      photoURL: photoURL ?? "",
      timestampCreate: Timestamp.now(),
    },
    { merge: true }
  );
};

export const updateUser = async ({ uid, displayName, photoURL, password }) => {
  const updates = {};
  
  if (displayName) updates.displayName = displayName;
  if (photoURL) updates.photoURL = photoURL;
  
  await setDoc(
    doc(db, `users/${uid}`),
    updates,
    { merge: true }
  );

  if (password) {
    // Assuming you have a method for updating the user's password
    const user = firebase.auth().currentUser;
    await user.updatePassword(password);
  }
};

export const updateFavorites = async ({ uid, list }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      favorites: list,
    },
    {
      merge: true,
    }
  );
};

export const updateCarts = async ({ uid, list }) => {
  await setDoc(
    doc(db, `users/${uid}`),
    {
      carts: list,
    },
    {
      merge: true,
    }
  );
};
