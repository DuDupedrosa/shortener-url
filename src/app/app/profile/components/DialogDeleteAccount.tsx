"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { http } from "@/app/http";
import { AxiosError, HttpStatusCode } from "axios";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import AlertError from "@/components/AlertError";
import { signOut } from "next-auth/react";
import { closeDialog } from "@/helper/methods/dialogHelper";

export default function DialogDeleteAccount({ name }: { name: string }) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");

  async function deleteAccount() {
    setLoading(true);
    try {
      await http.delete(`/api/user?lang=${i18n.language}`);
      window.localStorage.clear();
      signOut({ callbackUrl: "/auth?deleteAccount=success" });
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.status === HttpStatusCode.BadRequest
      ) {
        if (err.response) {
          setAlert(t(err.response.data.message));
        }
      }
    }
  }

  return (
    <dialog id="dialog_delete_account" className="modal">
      {name && (
        <div className="modal-box space-y-4">
          <div className="flex flex-col items-center text-center">
            <ExclamationTriangleIcon className="w-10 h-10 text-red-600 mb-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              {name} {t("user_delete_account_title")}
            </h2>
          </div>

          <p className="text-center text-sm font-medium text-gray-900">
            {t("user_delete_account_text")}
          </p>

          <div className="pt-4 border-t border-gray-200">
            {alert && alert.length > 0 && <AlertError message={alert} />}

            <div className="flex justify-end gap-2">
              <button
                disabled={loading}
                onClick={() => closeDialog("dialog_delete_account")}
                type="button"
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {t("cancel")}
              </button>
              <button
                disabled={loading}
                onClick={deleteAccount}
                type="button"
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                {loading && <span className="loading loading-spinner"></span>}
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
