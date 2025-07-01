"use client";

import MainHeader from "@/components/MainHeader";
import BasicData from "./BasicData";
import MainFooter from "@/components/MainFooter";

export default function ProfileComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainHeader />

      <div className="flex-grow px-8 pb-8 mt-12 max-w-7xl mx-auto w-full">
        <BasicData />
      </div>

      <MainFooter logged={true} />
    </div>
  );
}
