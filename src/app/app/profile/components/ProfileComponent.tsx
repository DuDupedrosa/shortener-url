"use client";

import MainHeader from "@/components/MainHeader";
import BasicData from "./BasicData";

export default function ProfileComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />

      <div className="px-8 pb-8 mt-12 max-w-7xl mx-auto">
        <BasicData />
      </div>
    </div>
  );
}
