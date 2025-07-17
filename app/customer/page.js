import dynamic from "next/dynamic";

const CustomerApp = dynamic(() => import("./CustomerApp"), { ssr: false });

export default function CustomerPage() {
  return <CustomerApp />;
}
