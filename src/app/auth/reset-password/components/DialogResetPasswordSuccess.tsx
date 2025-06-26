"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function DialogResetPasswordSuccess({
  open,
}: {
  open: boolean;
}) {
  const [countdown, setCountdown] = useState(20);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      // Reseta o countdown quando fechar o modal
      setCountdown(20);
      return;
    }

    if (countdown === 0) {
      router.push("/auth");
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, open, router]);

  return (
    <dialog
      id="modal_reset_password_success"
      className="modal"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="modal-box animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 text-green-700 p-4 rounded-full">
            <CheckIcon className="h-8 w-8" />
          </div>
        </div>

        <h3 className="font-semibold text-2xl text-gray-900 mb-3 text-center">
          {t("reset_password_with_success")}
        </h3>

        <p className="text-center text-base text-gray-900 mb-2">
          {t("reset_password_with_success_text_1")}{" "}
          <span className="font-semibold text-primary">{countdown}s</span>.
        </p>
        <p className="text-center text-base text-gray-900 mb-5">
          {t("click_button_go_direct")}
        </p>

        <div className="flex flex-col justify-center items-center">
          <button
            title={t("access_with_new_password")}
            className="btn btn-primary max-w-max flex items-center gap-2"
            onClick={() => router.push("/auth")}
          >
            {t("access_with_new_password")}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
