"use client";

import MainHeader from "@/components/MainHeader";
import MainFooter from "@/components/MainFooter";
import { useTranslation } from "react-i18next";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PoliticaPrivacidadePage() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainHeader anonymousArea={true} />

      <main className="flex-grow px-6 py-10 max-w-3xl mx-auto text-sm text-gray-700 space-y-6">
        <span
          onClick={() => router.back()}
          className="flex items-center gap-2 max-w-max p-2 text-lg text-primary hover:underline cursor-pointer transition"
        >
          <ArrowUturnLeftIcon className="w-6 h-6" />
          <span>{t("back")}</span>
        </span>

        <h1 className="text-2xl font-bold text-gray-900">
          {t("privacy_title")}
        </h1>
        <p>{t("privacy_intro")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_1_title")}
        </h2>
        <p>{t("privacy_section_1_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_2_title")}
        </h2>
        <p>{t("privacy_section_2_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_3_title")}
        </h2>
        <p>{t("privacy_section_3_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_4_title")}
        </h2>
        <p>{t("privacy_section_4_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_5_title")}
        </h2>
        <p>{t("privacy_section_5_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_6_title")}
        </h2>
        <p>{t("privacy_section_6_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_7_title")}
        </h2>
        <p>{t("privacy_section_7_text")}</p>

        <h2 className="text-lg font-semibold text-gray-800">
          {t("privacy_section_8_title")}
        </h2>
        <p>
          {t("privacy_section_8_text")}
          <a
            href={`mailto:${t("privacy_section_8_email")}`}
            className="text-primary ml-1"
          >
            {t("privacy_section_8_email")}
          </a>
        </p>
      </main>

      <MainFooter />
    </div>
  );
}
