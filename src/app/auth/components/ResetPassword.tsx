"use client";

import { http } from "@/app/http";
import AlertError from "@/components/AlertError";
import InputErrorMessage from "@/components/InputErrorMessage";
import SubmitButtonLoading from "@/components/SubmitButtonLoading";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError, HttpStatusCode } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

export default function ResetPassword({ onSignIn }: { onSignIn: () => void }) {
  const { t, i18n } = useTranslation();
  const [alert, setAlert] = useState<string>("");
  const [success, setSucces] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const resetPasswordSchema = z.object({
    email: z.string().email({ message: t("invalid_email") }),
  });
  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setAlert("");
    setSucces(false);
    setLoading(true);
    try {
      let payload = {
        email: data.email,
        lang: i18n.language,
        appBaseUrl: window.location.origin,
      };

      await http.post("/api/user/reset-password/send-link", payload);
      setEmail(data.email);
      setSucces(true);
      reset({
        email: "",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === HttpStatusCode.BadRequest) {
          setAlert(err.response.data.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <button title={t("back")} onClick={onSignIn} className="btn btn-ghost">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          {t("back_to_login")}
        </button>
      </div>

      <h2 className="text-center mb-2 text-3xl font-medium text-gray-900">
        {t("reset_password")}
      </h2>

      <p className="text-base font-normal max-w-lg mx-auto text-center text-gray-900">
        {t("reset_password_subtitle")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
        <div>
          <label className="input w-full">
            <EnvelopeIcon className="input-icon-inside-before" />
            <input
              type="text"
              id="email"
              {...register("email", {
                onChange: (e) => {
                  setAlert("");
                  setSucces(false);
                  setEmail("");
                },
              })}
              placeholder={t("email")}
              aria-label="Email"
            />
          </label>
          {errors.email && <InputErrorMessage message={errors.email.message} />}
        </div>

        {success && (
          <div role="alert" className="alert alert-success alert-soft mb-8">
            <span>{t("send_reset_password_link_to", { email })}</span>
          </div>
        )}

        {alert && alert.length > 0 && !success && (
          <AlertError message={alert} />
        )}

        <button
          disabled={loading}
          title={t("reset_password")}
          className="btn btn-primary w-full"
        >
          {loading && <SubmitButtonLoading />}
          {t("send_link")}
        </button>

        <span
          onClick={onSignIn}
          className="text-center underline transition-all duration-300 max-w-max mx-auto block text-sm text-gray-600 hover:text-primary cursor-pointer font-medium mt-5"
        >
          {t("already_register_or_want_register")}
        </span>

        {/* <p className="text-center text-xs text-gray-400 mt-10">
          © 2025 Snipply-url
        </p> */}
      </form>
    </div>
  );
}
