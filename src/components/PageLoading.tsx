"use client";

import { useTranslation } from "react-i18next";

export default function PageLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Loading Icon"
        className="animate-spin text-primary mb-4"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <p className="text-center text-lg text-gray-800 font-medium">
        <span className="block">{t("loading")}</span>
        <span className="block text-sm">{t("loading_text")}</span>
      </p>
    </div>
  );
}
