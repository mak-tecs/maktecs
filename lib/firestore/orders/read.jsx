"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useOrder({ id }) {
  const { data, error } = useSWRSubscription(
    ["orders", id],
    ([path, id], { next }) => {
      const ref = doc(db, `orders/${id}`);
      const unsub = onSnapshot(
        ref,
        (snapshot) => next(null, snapshot.data()),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  if (error) {
    console.log(error?.message);
  }

  return { data, error: error?.message, isLoading: data === undefined };
}

export function useOrders({ uid }) {
  // Create the SWR subscription
  const { data, error } = useSWRSubscription(
    ["orders", uid],
    ([path, uid], { next }) => {
      // Check for valid uid
      if (!uid) {
        // Call 'next' with an empty list to handle initial state when uid is invalid
        next(null, []); 
        // Return an unsub function since SWR expects it, even if nothing is subscribed
        return () => {}; 
      }

      // Create the Firestore query
      const ref = query(
        collection(db, path),
        where("uid", "==", uid),
        orderBy("timestampCreate", "desc")
      );

      // Start listening to changes
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const docs = snapshot.docs || []; // Ensure docs is an array
          next(null, docs.map((snap) => snap.data())); // Map over the docs safely
        },
        (err) => next(err, null)
      );

      // Return the unsubscribe function to meet SWR's expectation
      return () => unsub(); 
    }
  );

  // Log any errors that occur
  if (error) {
    console.error(error?.message);
  }

  // Return the subscription state
  return { data: data ?? [], error: error?.message, isLoading: data === undefined };
}

export function useAllOrders({ pageLimit, lastSnapDoc }) {
  const { data, error } = useSWRSubscription(
    ["orders", pageLimit, lastSnapDoc],
    ([path, pageLimit, lastSnapDoc], { next }) => {
      const ref = collection(db, path);
      let q = query(
        ref,
        limit(pageLimit ?? 10),
        orderBy("timestampCreate", "desc")
      );

      if (lastSnapDoc) {
        q = query(q, startAfter(lastSnapDoc));
      }

      const unsub = onSnapshot(
        q,
        (snapshot) =>
          next(null, {
            list:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs.map((snap) => snap.data()),
            lastSnapDoc:
              snapshot.docs.length === 0
                ? null
                : snapshot.docs[snapshot.docs.length - 1],
          }),
        (err) => next(err, null)
      );
      return () => unsub();
    }
  );

  return {
    data: data?.list,
    lastSnapDoc: data?.lastSnapDoc,
    error: error?.message,
    isLoading: data === undefined,
  };
}
