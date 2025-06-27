"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { http } from "@/app/http";
import { AxiosError, HttpStatusCode } from "axios";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import AlertError from "@/components/AlertError";
import { closeDialog } from "@/helper/methods/dialogHelper";
import { toast } from "sonner";

export default function DialogRemoveAvatar({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");

  async function removeAvatar() {
    setLoading(true);
    try {
      await http.delete(`/api/user/remove-avatar`);
      onSuccess();
      toast.success(t("saved"));
      closeDialog("dialog_remove_avatar");
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
    <dialog id="dialog_remove_avatar" className="modal">
      <div className="modal-box space-y-4">
        <div className="flex flex-col items-center text-center">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-600 mb-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("you_sure_remove_your_avatar")}
          </h2>
        </div>

        <div className="pt-4 border-t border-gray-200">
          {alert && alert.length > 0 && <AlertError message={alert} />}

          <div className="flex justify-end gap-2">
            <button
              disabled={loading}
              onClick={() => closeDialog("dialog_remove_avatar")}
              type="button"
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {t("cancel")}
            </button>
            <button
              title={t("remove")}
              disabled={loading}
              onClick={removeAvatar}
              type="button"
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              {loading && <span className="loading loading-spinner"></span>}
              {t("remove")}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
