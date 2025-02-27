"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  collectionGroup,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";
import { useState, useEffect } from "react";

export function useReviews({ productId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = `products/${productId}/reviews`;
    const ref = query(collection(db, path), orderBy("timestamp", "desc"));

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        try {
          const docs = snapshot.docs || [];
          setData(docs.map((snap) => snap.data()));
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [productId]);

  return { data, error, isLoading };
}
export function useAllReview() {
  debugger;
  const { data, error } = useSWRSubscription(
    ["reviews"],
    ([path], { next }) => {
      const ref = collectionGroup(db, path);
      const unsub = onSnapshot(
        ref,
        (snapshot) =>
          next(
            null,
            snapshot.docs.length === 0
              ? null
              : snapshot.docs.map((snap) => snap.data())
          ),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return { data, error: error?.message, isLoading: data === undefined };
}
