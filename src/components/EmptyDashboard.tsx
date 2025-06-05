"use client";

import DialogCreateShortenerLink from "@/app/app/dashboard/components/DialogCreateShortenerLink";
import IconHand from "@/assets/image/hand-hello.png";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function EmptyDashboard({ userName }: { userName: string }) {
  const { t } = useTranslation();

  function truncateText(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  function handleOpenDialogCreateShortenerLink() {
    const dialog = document.getElementById(
      "my_modal_4"
    ) as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
  }

  return (
    <div className="px-5">
      <div className="card max-w-xl mx-auto mt-20 bg-white shadow-md border border-green-300 rounded-lg">
        <div className="card-body items-center text-center px-8 py-6">
          <h2 className="card-title text-3xl flex flex-wrap items-center justify-center max-w-full overflow-hidden text-ellipsis">
            {t("hello")}, {truncateText(userName, 20)}
            <Image src={IconHand} alt="wave-hand" className="ml-2" />
          </h2>
          <p className="mt-3 text-base text-gray-700 space-y-1">
            <span>{t("empty_dashboard_text_1")}</span>
            <span>{t("empty_dashboard_text_2")}</span>
          </p>
          <div className="card-actions mt-6">
            <button
              onClick={() => handleOpenDialogCreateShortenerLink()}
              className="btn btn-primary"
            >
              {t("create_link")}
            </button>
          </div>
          {/* You can open the modal using document.getElementById('ID').showModal() method */}
          <DialogCreateShortenerLink />
        </div>
      </div>
    </div>
  );
}
