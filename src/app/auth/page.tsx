import { Suspense } from "react";
import AuthComponent from "./components/AuthComponent";
import MainFooter from "@/components/MainFooter";

export default function page() {
  return (
    <Suspense fallback={null}>
      <AuthComponent />
      <MainFooter />
    </Suspense>
  );
}
