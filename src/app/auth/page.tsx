"use client";

import { Suspense } from "react";
import AuthComponent from "./components/AuthComponent";
import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col">
      <>
        <MainHeader anonymousArea={true} />
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <Suspense fallback={null}>
            <AuthComponent />
          </Suspense>
        </div>
        <MainFooter />
      </>
    </div>
  );
}
