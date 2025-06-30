"use client";

import DialogCreateShortenerLink from "@/app/app/dashboard/components/DialogCreateShortenerLink";
import IconHand from "@/assets/image/hand-hello.png";
import { openDialog } from "@/helper/methods/dialogHelper";
import { truncateText } from "@/helper/methods/truncateText";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function EmptyDashboard({
  userName,
  onCreateShortener,
}: {
  userName: string;
  onCreateShortener: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="px-5">
      <div className="card max-w-xl mx-auto mt-20 bg-white shadow-md border border-green-300 rounded-lg">
        <div className="card-body items-center text-center px-8 py-6">
          <h2 className="card-title text-gray-900 text-3xl flex flex-wrap items-center justify-center max-w-full overflow-hidden text-ellipsis">
            {t("hello")}, {truncateText(userName, 20)}
            <Image src={IconHand} alt="wave-hand" className="ml-2" />
          </h2>
          <p className="mt-3 text-base text-gray-700 space-y-1">
            <span>{t("empty_dashboard_text_1")}</span>
            <span>{t("empty_dashboard_text_2")}</span>
          </p>
          <div className="card-actions mt-6">
            <button
              onClick={() => openDialog("dialog_create_shortener")}
              className="btn btn-primary"
            >
              {t("create_link")}
            </button>
          </div>
          <DialogCreateShortenerLink onSuccess={() => onCreateShortener()} />
        </div>
      </div>
    </div>
  );
}
