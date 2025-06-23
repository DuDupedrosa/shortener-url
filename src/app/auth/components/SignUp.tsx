"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError, HttpStatusCode } from "axios";
import { http } from "@/app/http";
import AlertError from "@/components/AlertError";

export default function SignUp({
  onSignIn,
  onRegister,
}: {
  onSignIn: () => void;
  onRegister: (email: string) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>("");
  const { t } = useTranslation();
  const [isRegistered, setIsRegistered] = useState<boolean>(true);

  const loginSchema = z
    .object({
      name: z.string().min(1, { message: t("required_field") }),
      email: z.string().email({ message: t("invalid_email") }),
      password: z.string().min(6, { message: t("min_6_caracteres") }),
      confirmPassword: z.string().min(6, { message: t("min_6_caracteres") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("passwords_do_not_match"),
    });
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setAlert("");

    try {
      const { confirmPassword, ...payload } = data;
      await http.post("/api/register", payload);
      setIsRegistered(true);
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

  function handleSignIn() {
    const email = getValues("email");

    if (email) {
      onRegister(email.trim());
    }
  }

  useEffect(() => {
    setIsRegistered(false);
  }, []);

  return (
    <div>
      {isRegistered && (
        <>
          <div
            role="alert"
            className="alert alert-success alert-soft max-w-xl mb-5"
          >
            <span>{t("create_account_success")}</span>
          </div>
          <button
            title="Start Session"
            onClick={() => handleSignIn()}
            type="button"
            className="btn btn-primary w-full"
          >
            {t("start_session")}
          </button>
        </>
      )}

      {!isRegistered && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="input w-full">
              <UserIcon className="input-icon-inside-before" />
              <input
                type="text"
                id="name"
                {...register("name")}
                placeholder={t("full_name")}
                aria-label="Full name"
              />
            </label>
            {errors.name && (
              <span className="input-error-message">
                <ExclamationTriangleIcon />
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <label className="input w-full">
              <EnvelopeIcon className="input-icon-inside-before" />
              <input
                type="text"
                id="email"
                {...register("email")}
                placeholder={t("email")}
                aria-label="Email"
              />
            </label>
            {errors.email && (
              <span className="input-error-message">
                <ExclamationTriangleIcon />
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <label className="input w-full">
              <LockClosedIcon className="input-icon-inside-before" />

              <input
                type="password"
                id="password"
                {...register("password")}
                placeholder={t("password")}
                aria-label="Password"
              />
            </label>
            {errors.password && (
              <span className="input-error-message">
                <ExclamationTriangleIcon />
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <label className="input w-full">
              <LockClosedIcon className="input-icon-inside-before" />

              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder={t("confirm_password")}
                aria-label="Confirm password"
              />
            </label>
            {errors.confirmPassword && (
              <span className="input-error-message">
                <ExclamationTriangleIcon />
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          {alert && alert.length > 0 && <AlertError message={alert} />}

          {!isRegistered && (
            <>
              <button
                title="Create Account"
                disabled={loading}
                className="btn btn-primary w-full capitalize"
              >
                {loading && <span className="loading loading-spinner"></span>}
                {t("create_account")}
              </button>
              <span
                onClick={() => onSignIn()}
                className="text-center underline transition-all duration-300 max-w-max mx-auto block text-sm text-gray-600 hover:text-primary cursor-pointer font-medium mt-5"
              >
                {t("sign_in_login")}
              </span>
            </>
          )}
        </form>
      )}
    </div>
  );
}
