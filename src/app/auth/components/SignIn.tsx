"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  EnvelopeIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AlertError from "@/components/AlertError";

export default function SignIn({
  onCreateAccount,
  email,
}: {
  onCreateAccount: () => void;
  email: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [alert, setAlert] = useState<string>("");
  const { t } = useTranslation();

  const loginSchema = z.object({
    email: z.string().email({ message: t("invalid_email") }),
    password: z.string().min(6, { message: t("min_6_caracteres") }),
  });
  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setAlert("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        const errorKeys = [
          "user_not_register",
          "user_not_registered_by_credentials",
          "invalid_password",
        ];

        if (errorKeys.includes(res.error)) {
          setAlert(t(res.error));
        } else {
          setAlert(t("error_occurred"));
        }
      } else {
        router.push("/app/dashboard");
      }
    } catch (err) {
      setAlert(t("error_occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email && email.length > 0) {
      setValue("email", email);
    }
  }, [email]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      {alert && alert.length > 0 && (
        <div className="w-full max-w-xl">
          <AlertError message={alert} />
        </div>
      )}
      <button
        title="Start session"
        disabled={loading}
        className="btn btn-primary w-full capitalize"
      >
        {loading && <span className="loading loading-spinner"></span>}
        {t("start_session")}
      </button>
      <span
        onClick={() => onCreateAccount()}
        className="text-center underline transition-all duration-300 max-w-max mx-auto block text-sm text-gray-600 hover:text-primary cursor-pointer font-medium mt-5"
      >
        {t("create_account_login")}
      </span>
    </form>
  );
}
