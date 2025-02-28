import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { admin, adminDB } from "@/lib/firebase_admin";
import Link from "next/link";

export async function generateMetadata({ params }) {
  return {
    title: "Checkout" + params.checkout_id,
    description: "",
  };
}

export async function generateStaticParams() {
  const list_ = await adminDB.collectionGroup("checkout_sessions_cod").get();

  return list_.docs.map((doc) => {
    return {
      checkout_id: doc.data().id,
    };
  });
}

export default async function Page({ params }) {
  const { checkout_id } = params;

  if (!checkout_id) {
    return <></>;
  }

  let checkout;
  try {
    checkout = await fetchCheckout(checkout_id);
  } catch (error) {
    throw new Error(`Failed to fetch checkout: ${error.message}`);
  }

  let result;
  try {
    result = await processOrder({ checkout });
  } catch (error) {
    throw new Error(`Failed to process order: ${error.message}`);
  }

  return (
    <main>
      <Header />
      <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <div className="flex justify-center w-full">
          <img src="/svgs/Mobile payments-rafiki.svg" className="h-48" alt="" />
        </div>
        <h1 className="text-2xl font-semibold text-green">
          Your Order Is{" "}
          <span className="font-bold text-green-600">Successfully</span> Placed
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/"}>
            <button className="flex-1 bg-gray-700 text-white p-4 rounded-lg text-medium w-full">
              Go To Home Page
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

async function fetchCheckout(checkoutId) {
  const list_ = await adminDB.collectionGroup("checkout_sessions_cod").get();
  const list = list_.docs.find((doc) => doc.data().id == checkoutId);

  if (!list) {
    throw new Error(`No checkout session found for ID: ${checkoutId}`);
  }
  // Return the document data instead of the snapshot
  return list.data();
}

async function processOrder({ checkout }) {
  if (!checkout?.id) {
    throw new Error("Invalid checkout data received.");
  }

  const order = await adminDB.doc(`orders/${checkout?.id}`).get();
  if (order.exists) {
    return false; // Order already exists
  }

  const uid = checkout?.metadata?.uid;

  // Validate payment data
  const amount = checkout?.line_items?.reduce((prev, curr) => {
    const unitAmount = curr?.price_data?.unit_amount || 0;
    const quantity = curr?.quantity || 0;
    return prev + unitAmount * quantity;
  }, 0);

  if (amount <= 0) {
    throw new Error("Invalid payment amount calculated.");
  }

  await adminDB.doc(`orders/${checkout?.id}`).set({
    checkout: checkout,
    payment: {
      amount,
    },
    uid: uid,
    id: checkout?.id,
    paymentMode: "cod",
    status:"pending",
    timestampCreate: admin.firestore.Timestamp.now(),
  });

  const productList = checkout?.line_items?.map((item) => {
    return {
      productId: item?.price_data?.product_data?.metadata?.productId,
      quantity: item?.quantity,
    };
  });

  // Check if productList is valid
  if (!productList || productList.length === 0) {
    throw new Error("No products found in the checkout session.");
  }

  const user = await adminDB.doc(`users/${uid}`).get();
  const productIdsList = productList?.map((item) => item?.productId);

  const newCartList = (user?.data()?.carts ?? []).filter(
    (cartItem) => !productIdsList.includes(cartItem?.id)
  );

  await adminDB.doc(`users/${uid}`).set(
    {
      carts: newCartList,
    },
    { merge: true }
  );

  const batch = adminDB.batch();

  productList?.forEach((item) => {
    batch.update(adminDB.doc(`products/${item?.productId}`), {
      orders: admin.firestore.FieldValue.increment(item?.quantity),
    });
  });

  await batch.commit();
  return true;
}
