"use client";

import { Suspense } from "react";
import RedirectComponent from "./components/RedirectComponent";
import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MainHeader anonymousArea={true} />

      <div className="flex-grow flex flex-col justify-center items-center p-8">
        <Suspense fallback={null}>
          <RedirectComponent />
        </Suspense>
      </div>

      <MainFooter />
    </div>
  );
}
