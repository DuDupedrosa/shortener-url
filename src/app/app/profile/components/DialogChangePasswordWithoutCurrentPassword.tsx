"use client";

import ErrorInputMessage from "@/components/ErrorInputMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useTranslation } from "react-i18next";
import { http } from "@/app/http";
import { AxiosError, HttpStatusCode } from "axios";
import AlertError from "@/components/AlertError";
import { closeDialog } from "@/helper/methods/dialogHelper";
import { signOut } from "next-auth/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import RevealOrHiddenPasswordsComponent from "@/components/RevealOrHiddenPasswordsComponent";

const labelStyle = "text-sm text-start font-medium text-gray-700";
const inputStyle = "input input-bordered w-full";

export default function DialogChangePasswordWithoutCurrentPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const { t } = useTranslation();
  const [showPasswords, setShowPasswords] = useState<boolean>(false);

  const changePasswordSchema = z
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
  type changePasswordSchemaType = z.infer<typeof changePasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<changePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: changePasswordSchemaType) => {
    setLoading(true);
    setAlert("");
    try {
      let payload = {
        newPassword: data.newPassword,
      };
      await http.patch("/api/user/change-password", payload);
      window.localStorage.clear();
      signOut({ callbackUrl: "/auth?changePassword=success" });
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.status === HttpStatusCode.BadRequest
      ) {
        if (err.response) {
          setAlert(t(err.response.data.message));
        }
      }
      setLoading(false);
    }
  };

  function resetValues() {
    reset({
      newPassword: undefined,
      confirmNewPassword: undefined,
    });
  }

  function handleCloseDialog() {
    resetValues();
    closeDialog("dialog_change_password_without_current_password");
  }

  return (
    <dialog
      id="dialog_change_password_without_current_password"
      className="modal"
    >
      <div className="modal-box">
        <h2 className="text-2xl text-start font-semibold text-gray-900 mb-1">
          {t("change_password")}
        </h2>
        <p className="text-sm text-start text-gray-600">
          {t("fill_the_fields_to_change_password")}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className={labelStyle}>
              {t("new_password")}
            </label>

            <div className="relative">
              <div className="absolute z-50 left-3 top-1/2 -translate-y-1/2">
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                className={`${inputStyle} pl-10`}
                placeholder="******"
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
              />
            </div>

            {errors.newPassword?.message && (
              <ErrorInputMessage message={errors.newPassword.message} />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmNewPassword" className={labelStyle}>
              {t("confirm_new_password")}
            </label>
            <div className="relative">
              <div className="absolute z-50 left-3 top-1/2 -translate-y-1/2">
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <input
                id="confirmNewPassword"
                type={showPasswords ? "text" : "password"}
                className={`${inputStyle} pl-10`}
                placeholder="******"
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
              />
            </div>
            {errors.confirmNewPassword?.message && (
              <ErrorInputMessage message={errors.confirmNewPassword.message} />
            )}
          </div>

          <RevealOrHiddenPasswordsComponent
            showPasswords={showPasswords}
            handlePassword={(newValue) => setShowPasswords(newValue)}
          />

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
              title={t("change_password")}
            >
              {loading && <span className="loading loading-spinner"></span>}
              {t("change_password")}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
