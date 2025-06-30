"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { http } from "@/app/http";
import { AxiosError, HttpStatusCode } from "axios";
import { toast } from "sonner";
import { Shortener } from "@/types/shortener";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { getShortenerUrl } from "@/helper/methods/getShortenerUrl";
import AlertError from "@/components/AlertError";
import { closeDialog } from "@/helper/methods/dialogHelper";
import SubmitButtonLoading from "@/components/SubmitButtonLoading";

export default function DialogDeleteShortenerLink({
  shortener,
  onSuccess,
  onCloseDialog,
}: {
  shortener: Shortener | null;
  onSuccess: () => void;
  onCloseDialog: () => void;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");

  function handleCloseDialog() {
    closeDialog("dialog_delete_shortener");
  }

  async function deleteShortener() {
    setLoading(true);
    try {
      if (!shortener) return;
      await http.delete(`/api/shortener/?id=${shortener.id}`);
      toast.success(t("delete_success_link"));
      handleCloseDialog();
      onSuccess();
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.status === HttpStatusCode.BadRequest
      ) {
        if (err.response) {
          setAlert(t(err.response.data.message));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id="dialog_delete_shortener" className="modal">
      {shortener && (
        <div className="modal-box space-y-4">
          <div className="flex flex-col items-center text-center">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("are_you_sure_delete_link")}
            </h2>
          </div>

          <div>
            <span className="text-sm mb-1 block text-gray-500 font-semibold">
              {t("shortener_url")}
            </span>
            <div className="flex items-center justify-between gap-2">
              <a
                rel="noopener noreferrer"
                title={t("open_new_window")}
                href={getShortenerUrl(shortener.label)}
                target="_blank"
                className="text-sm text-gray-700 truncate hover:underline"
              >
                {getShortenerUrl(shortener.label)}
              </a>
            </div>
          </div>

          <div>
            <span className="text-sm block mb-1 font-semibold text-gray-500">
              {t("original_url")}
            </span>

            <div className="flex items-center justify-between gap-2">
              <a
                rel="noopener noreferrer"
                title={t("open_new_window")}
                href={shortener.originalUrl}
                target="_blank"
                className="text-sm text-gray-700 truncate hover:underline"
              >
                {shortener.originalUrl}
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            {alert && alert.length > 0 && <AlertError message={alert} />}

            <div className="flex justify-end gap-2">
              <button
                disabled={loading}
                onClick={handleCloseDialog}
                type="button"
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {t("cancel")}
              </button>
              <button
                disabled={loading}
                onClick={deleteShortener}
                type="button"
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                {loading && <SubmitButtonLoading />}
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
