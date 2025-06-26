"use client";

import { useParams, useRouter } from "next/navigation";
import MainHeader from "@/components/MainHeader";
import {
  ExclamationTriangleIcon,
  EyeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import z from "zod";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import AlertError from "@/components/AlertError";
import { AxiosError, HttpStatusCode } from "axios";
import { http } from "@/app/http";
import DialogResetPasswordSuccess from "../components/DialogResetPasswordSuccess";

export default function Page() {
  const params = useParams();
  const slug = params.slug;
  const { t } = useTranslation();
  const [alert, setAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState<boolean>(false);
  const router = useRouter();

  const resetPasswordSchema = z
    .object({
      newPassword: z
        .string()
        .min(6, { message: t("min_6_caracteres") })
        .regex(/[A-Za-z]/, { message: t("required_alphabetical_caracter") })
        .regex(/[0-9]/, { message: t("required_number_caracter") })
        .refine((val) => !/\s/.test(val), {
          message: t("without_empty_spaces"),
        }),
      confirmNewPassword: z.string().min(6, { message: t("min_6_caracteres") }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      path: ["confirmNewPassword"],
      message: t("passwords_do_not_match"),
    });

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    reset,
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function handleOpenDialogSuccess() {
    const dialog = document.getElementById(
      "modal_reset_password_success"
    ) as HTMLDialogElement;

    if (dialog) {
      dialog.showModal();
      setSuccess(true);
    }
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setAlert("");
    try {
      let payload = {
        newPassword: data.newPassword,
        code: slug,
      };
      await http.post("/api/user/reset-password", payload);
      handleOpenDialogSuccess();
      reset({
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === HttpStatusCode.BadRequest ||
          err.response?.status === HttpStatusCode.NotFound
        ) {
          setAlert(t(err.response.data.message));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader anonymousArea={true} />

      <div className="px-8 mt-12">
        <div className="bg-base-100 p-8  mx-auto rounded-2xl shadow-xl border border-gray-200 w-full max-w-md transition-all">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 text-green-700 p-4 rounded-full">
              <LockClosedIcon className="h-8 w-8" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            {t("reset_password")}
          </h1>
          <p className="text-sm text-center text-gray-600 mb-6">
            {t("fill_with_your_new_password")}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="input w-full">
                <LockClosedIcon className="input-icon-inside-before" />

                <input
                  type={showPasswords ? "text" : "password"}
                  id="password"
                  {...register("newPassword", {
                    onChange: (e) => {
                      const valueWithoutSpaces = e.target.value.replace(
                        /\s/g,
                        ""
                      );
                      setValue("newPassword", valueWithoutSpaces, {
                        shouldValidate: true,
                      });
                    },
                  })}
                  placeholder={t("new_password")}
                  aria-label="New Password"
                />
              </label>
              {errors.newPassword && (
                <span className="input-error-message">
                  <ExclamationTriangleIcon />
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div>
              <label className="input w-full">
                <LockClosedIcon className="input-icon-inside-before" />

                <input
                  type={showPasswords ? "text" : "password"}
                  id="password"
                  {...register("confirmNewPassword", {
                    onChange: (e) => {
                      const valueWithoutSpaces = e.target.value.replace(
                        /\s/g,
                        ""
                      );
                      setValue("confirmNewPassword", valueWithoutSpaces, {
                        shouldValidate: true,
                      });
                    },
                  })}
                  placeholder={t("confirm_new_password")}
                  aria-label="New Password"
                />
              </label>
              {errors.confirmNewPassword && (
                <span className="input-error-message">
                  <ExclamationTriangleIcon />
                  {errors.confirmNewPassword.message}
                </span>
              )}
            </div>

            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="p-1 text-sm cursor-pointer text-gray-600 underline transition-colors duration-200 hover:text-green-600"
              >
                {showPasswords ? t("hidden_passwords") : t("reveal_passwords")}
              </button>
            </div>

            {alert && alert.length > 0 && <AlertError message={alert} />}

            <button
              type="submit"
              disabled={loading}
              title={t("reset_password")}
              className="btn btn-primary w-full mt-2"
            >
              {loading && <span className="loading loading-spinner"></span>}
              {t("reset_password")}
            </button>

            <span
              onClick={() => router.push("/auth")}
              className="text-center underline transition-all duration-300 max-w-max mx-auto block text-sm text-gray-600 hover:text-primary cursor-pointer font-medium mt-5"
            >
              {t("go_to_login")}
            </span>
          </form>

          <DialogResetPasswordSuccess open={success} />
        </div>
      </div>
    </div>
  );
}
