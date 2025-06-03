"use client";

import IconHand from "@/assets/image/hand-hello.png";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function EmptyDashboard({ userName }: { userName: string }) {
  const { t } = useTranslation();

  function truncateText(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  return (
    <div className="px-5">
      <div className="card max-w-xl mx-auto mt-20 bg-base-100 shadow-xl border border-primary">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-3xl whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            {t("hello")}, {truncateText(userName, 20)}
            <Image src={IconHand} alt="wave-hand" />
          </h2>
          <p className="mt-2 text-base flex flex-col text-gray-600">
            <span>{t("empty_dashboard_text_1")}</span>
            <span>{t("empty_dashboard_text_2")}</span>
          </p>
          <div className="card-actions mt-6">
            <button className="btn btn-primary">{t("create_link")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
