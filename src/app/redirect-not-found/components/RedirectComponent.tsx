"use client";

import { HttpStatusCode } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import ChangeLanguage from "@/components/ChangeLanguage";
import { useTranslation } from "react-i18next";

export default function RedirectComponent() {
  const router = useRouter();
  const [params, setParams] = useState<{
    key: string;
    errorKey: string;
  } | null>(null);
  const { t } = useTranslation();
  const searchParams = useSearchParams();

  function handleTryAgain() {
    router.push(`/to/${params?.key}`);
  }

  useEffect(() => {
    const key = searchParams.get("key");
    const errorKey = searchParams.get("errorKey");

    if (searchParams && key && errorKey) {
      setParams({ key, errorKey });
    }
  }, [searchParams]);

  return (
    <div className="relative">
      <ChangeLanguage />

      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
          {params ? (
            <>
              <div className="flex justify-center mb-4">
                <ExclamationTriangleIcon className="w-12 h-12 text-warning" />
              </div>
              <h2 className="text-2xl font-bold text-center text-base-content mb-2">
                {t("redirect_failed")}
              </h2>
              <p className="text-center text-sm text-base-content mb-4">
                {t("error_intro")}
              </p>

              <ul className="list-disc list-inside text-sm text-base-content mb-6 space-y-1">
                {Number(params.errorKey) === HttpStatusCode.NotFound && (
                  <>
                    <li>{t("error_link_incorrect")}</li>
                    <li>{t("error_link_removed")}</li>
                    <li>{t("error_link_confirm")}</li>
                  </>
                )}
                {Number(params.errorKey) ===
                  HttpStatusCode.ServiceUnavailable && (
                  <li>{t("error_server_unstable")}</li>
                )}
              </ul>

              {/* Link com botão de cópia */}
              <div className="bg-base-200 p-3 rounded-lg mb-4 flex items-center justify-between text-sm text-base-content">
                <span className="truncate max-w-[95%]">
                  {`${window.location.origin}/to/${params.key}`}
                </span>
              </div>

              {Number(params.errorKey) !== HttpStatusCode.NotFound && (
                <button
                  title={t("try_again")}
                  onClick={handleTryAgain}
                  className="btn btn-secondary"
                >
                  {t("try_again")}
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-base-content opacity-60 animate-pulse">
              {t("loading_error_info")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
