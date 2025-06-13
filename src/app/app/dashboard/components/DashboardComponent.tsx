"use client";

import ShortenerCard from "./ShortenerCard";
import IconHand from "@/assets/image/hand-hello.png";
import { Shortener } from "@/types/shortener";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import DialogCreateShortenerLink from "./DialogCreateShortenerLink";
import DialogEditShortenerLink from "./DialogEditShortenerLink";
import { useState } from "react";
import DialogDeleteShortenerLink from "./DialogDeleteShortenerLink";

export default function DashboardComponent({
  shorteners,
  userName,
  onReFetch,
}: {
  shorteners: Shortener[];
  userName: string;
  onReFetch: () => void;
}) {
  const { t } = useTranslation();
  const [shortenerToEdit, setShortenerToEdit] = useState<Shortener | null>(
    null
  );
  const [shortenerToDelete, setShortenerToDelete] = useState<Shortener | null>(
    null
  );

  function openDialog(dialogId: string) {
    const dialog = document.getElementById(
      dialogId
    ) as HTMLDialogElement | null;
    if (dialog) dialog.showModal();
  }

  function handleEditShortener(data: Shortener) {
    setShortenerToEdit(data);
    openDialog("dialog_edit_shortener");
  }

  function handleDeleteShortener(data: Shortener) {
    setShortenerToDelete(data);
    openDialog("dialog_delete_shortener");
  }

  return (
    <div className="px-8 pb-8 mt-12 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end gap-5">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            {t("hello")}, {userName}
            <Image src={IconHand} alt="wave-hand" className="ml-2" />
          </h1>
          <p className="text-base text-gray-500">{t("dashboard_intro")}</p>
        </div>

        <button
          onClick={() => openDialog("dialog_create_shortener")}
          className="btn flex md:hidden max-w-[220px]  btn-primary"
        >
          <PlusCircleIcon className="w-6" />
          {t("add_new")}
        </button>
      </div>

      <div className="flex gap-5 flex-wrap items-stretch">
        {shorteners.map((shortener: Shortener, i: number) => {
          return (
            <ShortenerCard
              handleDeleteShortener={(data: Shortener) =>
                handleDeleteShortener(data)
              }
              handleEditShortener={(data: Shortener) =>
                handleEditShortener(data)
              }
              shortener={shortener}
              key={i}
            />
          );
        })}
        <div
          onClick={() => openDialog("dialog_create_shortener")}
          className="border-2 border-dashed border-neutral rounded-xl cursor-pointer 
      hover:bg-gray-100 transition-all flex flex-col justify-center items-center gap-3 w-full sm:w-[350px] mt-auto h-[180px]"
        >
          <PlusIcon className="text-gray-500 w-8" />
          <p className="font-medium text-center text-lg text-gray-500">
            {t("add_new")}
          </p>
        </div>
      </div>
      <DialogCreateShortenerLink onSuccess={() => onReFetch()} />
      <DialogEditShortenerLink
        onCloseDialog={() => setShortenerToEdit(null)}
        onSuccess={() => onReFetch()}
        shortener={shortenerToEdit}
      />
      <DialogDeleteShortenerLink
        onCloseDialog={() => setShortenerToDelete(null)}
        onSuccess={() => onReFetch()}
        shortener={shortenerToDelete}
      />
    </div>
  );
}
