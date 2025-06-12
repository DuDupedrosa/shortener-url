"use client";

import ErrorInputMessage from "@/components/ErrorInputMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import validator from "validator";
import { useTranslation } from "react-i18next";
import { http } from "@/app/http";
import { AxiosError, HttpStatusCode } from "axios";
import { toast } from "sonner";
import { Shortener } from "@/types/shortener";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const labelStyle = "text-sm text-start font-medium text-gray-700";
const inputStyle = "input input-bordered w-full";

export default function DialogEditShortenerLink({
  shortener,
  onSuccess,
  onCloseDialog,
}: {
  shortener: Shortener | null;
  onSuccess: () => void;
  onCloseDialog: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const { t } = useTranslation();

  const loginSchema = z.object({
    url: z.string().refine((val) => validator.isURL(val, {}), {
      message: t("invalid_url"),
    }),
    label: z.string().optional(),
  });

  type EditShortenerData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = useForm<EditShortenerData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      url: undefined,
    },
  });

  function resetValues() {
    reset();
    setValue("url", "");
    setValue("label", "");
    setAlert("");
  }

  function handleCloseDialog() {
    const dialog = document.getElementById(
      "dialog_edit_shortener"
    ) as HTMLDialogElement | null;
    if (dialog) {
      resetValues();
      dialog.close();
      onCloseDialog();
    }
  }

  const onSubmit = async (data: EditShortenerData) => {
    setLoading(true);
    setAlert("");
    try {
      let payload = { url: data.url };
      await http.patch("/api/shortener", payload);
      toast.success(t("success_edit_shortener"));
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
  };

  useEffect(() => {
    if (shortener) {
      setValue("url", shortener.originalUrl);
      setValue("label", shortener.label);
    }
  }, [shortener]);

  return (
    <dialog id="dialog_edit_shortener" className="modal">
      {shortener && (
        <div className="modal-box">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {t("edit_shortener_link")}
          </h2>
          <p className="text-sm text-gray-600">
            {t("edit_shortener_link_subtitle")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="url" className={labelStyle}>
                {t("destination_url")}
              </label>
              <input
                id="url"
                type="text"
                className={inputStyle}
                placeholder="https://..."
                {...register("url")}
              />
              {errors.url?.message && (
                <ErrorInputMessage message={errors.url.message} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="label" className={labelStyle}>
                {t("url_custon")}
              </label>
              <p className="mt-2 flex text-start items-start gap-2 text-sm font-semibold text-gray-800 leading-snug">
                <InformationCircleIcon className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-[3px]" />
                O identificador personalizado (label) não pode ser editado após
                a criação do link. Para alterá-lo, exclua e crie um novo.
              </p>
              <input
                disabled={true}
                id="label"
                type="text"
                className={inputStyle}
                placeholder="ex: minha-url-curta"
                {...register("label")}
              />
              {/* {errors.label?.message && (
                <ErrorInputMessage message={errors.label.message} />
              )} */}
            </div>

            {alert && alert.length > 0 && (
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{alert}</span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                disabled={loading}
                type="button"
                className="btn btn-outline h-10 text-gray-700 hover:bg-error hover:text-white sm:flex-1"
                onClick={handleCloseDialog}
              >
                {t("close")}
              </button>
              <button
                disabled={loading}
                type="submit"
                className="btn h-10 btn-primary sm:flex-1"
              >
                {loading && <span className="loading loading-spinner"></span>}
                {t("edit")}
              </button>
            </div>
          </form>
        </div>
      )}
    </dialog>
  );
}
