// app/customer/CustomerAppWrapper.jsx
"use client";

import dynamic from "next/dynamic";

const CustomerApp = dynamic(() => import("./CustomerApp"), { ssr: false });

export default function CustomerAppWrapper() {
  return <CustomerApp />;
}
