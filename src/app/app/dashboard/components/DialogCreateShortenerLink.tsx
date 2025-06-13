"use client";

import ErrorInputMessage from "@/components/ErrorInputMessage";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import validator from "validator";
import { useTranslation } from "react-i18next";
import { http } from "@/app/http";
import { AxiosError, HttpStatusCode } from "axios";
import { toast } from "sonner";
import AlertError from "@/components/AlertError";

const labelStyle = "text-sm text-start font-medium text-gray-700";
const inputStyle = "input input-bordered w-full";

export default function DialogCreateShortenerLink({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [showInputLabel, setShowInputLabel] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const { t } = useTranslation();

  const loginSchema = z
    .object({
      url: z.string().refine((val) => validator.isURL(val, {}), {
        message: t("invalid_url"),
      }),
      randomLabel: z.boolean(),
      label: z
        .string()
        .optional()
        .refine((val) => !val || val.trim().length >= 3, {
          message: t("label_url_min_3_caracteres"),
        })
        .refine((val) => !val || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(val), {
          message: t("label_url_rule"),
        }),
    })
    .superRefine((data, ctx) => {
      if (!data.randomLabel && (!data.label || !data.label.trim())) {
        ctx.addIssue({
          path: ["label"],
          code: z.ZodIssueCode.custom,
          message: t("label_url_required"),
        });
      }
    });
  type CreateShortenerData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = useForm<CreateShortenerData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      url: undefined,
      randomLabel: true,
      label: undefined,
    },
  });

  function resetValues() {
    reset();
    setValue("label", undefined);
    setValue("url", "");
    setValue("randomLabel", true);
    setShowInputLabel(false);
    setAlert("");
  }

  function handleCloseDialog() {
    const dialog = document.getElementById(
      "dialog_create_shortener"
    ) as HTMLDialogElement | null;
    if (dialog) {
      resetValues();
      dialog.close();
    }
  }

  const onSubmit = async (data: CreateShortenerData) => {
    setLoading(true);
    setAlert("");
    try {
      let payload = { ...data };
      await http.post("/api/shortener", payload);
      toast.success(t("success_create_shortener"));
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

  return (
    <dialog id="dialog_create_shortener" className="modal">
      <div className="modal-box">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          {t("create_shortener_link")}
        </h2>
        <p className="text-sm text-gray-600">
          {t("create_shortener_link_subtitle")}
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

          <div>
            <div className="w-full flex flex-col items-start mb-4">
              <label
                htmlFor="random-label"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="random-label"
                  type="checkbox"
                  className="toggle toggle-secondary toggle-sm"
                  {...register("randomLabel", {
                    onChange: (e) => {
                      const checked = e.target.checked;
                      setValue("label", undefined);
                      setShowInputLabel(!checked);
                      setAlert("");
                    },
                  })}
                />
                <span className="text-sm font-medium text-gray-700">
                  {t("generate_random_label")}
                </span>
              </label>
              {!showInputLabel && (
                <p className="mt-3 flex text-start items-start gap-2 text-xs text-gray-800 leading-snug">
                  <InformationCircleIcon className="w-4 h-4 flex-shrink-0 text-yellow-600 mt-[3px]" />
                  <span>
                    {t("generate_random_label_helper")}
                    <span className="flex gap-1 items-center">
                      {t("short_ex")}:
                      <span className="font-bold">
                        {window.location.origin}/r2f
                      </span>
                    </span>
                  </span>
                </p>
              )}
            </div>

            <div
              className={`transition-all duration-500 ease-out transform ${
                showInputLabel
                  ? "opacity-100 translate-y-0 pointer-events-auto max-h-[1000px]"
                  : "opacity-0 -translate-y-2 pointer-events-none max-h-0 overflow-hidden"
              }`}
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="label" className={labelStyle}>
                  {t("url_custon")}
                </label>
                <p className="mb-2 flex text-start items-start gap-2 text-xs text-gray-800 leading-snug">
                  <InformationCircleIcon className="w-5 h-5 flex-shrink-0 text-yellow-600 mt-[3px]" />
                  <span>
                    {t("random_label_description_1")}
                    <span className="block mt-1">
                      {t("example")}:{" "}
                      <code className="font-bold">{t("my_custom_link")}</code>
                      <span className="block my-1">
                        {t("random_label_description_3")}:{" "}
                        <span className="font-bold">
                          {window.location.origin}/
                        </span>
                      </span>
                      <span className="block">
                        {t("random_label_description_2")}:{" "}
                        <span className="font-bold">{t("lowercase")}</span>
                      </span>
                    </span>
                  </span>
                </p>
                <input
                  id="label"
                  type="text"
                  className={inputStyle}
                  placeholder="ex: minha-url-curta"
                  {...register("label", {
                    onChange: (e) => {
                      const input = e.target as HTMLInputElement;
                      let val = input.value.toLowerCase();
                      val = val.replace(/[^a-z0-9-]/g, ""); // deixa só letras, números e hífen
                      val = val.replace(/-{2,}/g, "-"); // remove hífens duplos (--)
                      input.value = val;
                    },
                  })}
                />
                {errors.label?.message && (
                  <ErrorInputMessage message={errors.label.message} />
                )}
              </div>
            </div>
          </div>

          {alert && alert.length > 0 && <AlertError message={alert} />}

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
              {t("send")}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
