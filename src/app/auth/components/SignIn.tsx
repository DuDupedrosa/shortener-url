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
import { http } from "@/app/http";
import { toast } from "sonner";
import { AxiosError, HttpStatusCode } from "axios";
import OTPComponent from "./OTPComponent";
import SubmitButtonLoading from "@/components/SubmitButtonLoading";
import InputErrorMessage from "@/components/InputErrorMessage";

const componentSteps = {
  LOGIN: 1,
  OTP: 2,
};

interface LoginData {
  email: string;
  password: string;
}

export default function SignIn({
  onCreateAccount,
  email,
  onResetPassword,
}: {
  onCreateAccount: () => void;
  email: string;
  onResetPassword: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [alert, setAlert] = useState<string>("");
  const { t, i18n } = useTranslation();
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [step, setStep] = useState<number>(componentSteps.LOGIN);

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

  async function otpTrigger(data: LoginData) {
    try {
      if (!data) return;
      let payload = { lang: i18n.language, ...data };
      await http.post("/api/otp/send", payload);
      setStep(componentSteps.OTP);
      toast.success(t("code_send_sucess"));
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response &&
          err.response.status !== HttpStatusCode.InternalServerError
        ) {
          toast.error(t("error_occurred"));
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setAlert("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      setLoginData({
        email: data.email,
        password: data.password,
      });
      if (res?.error) {
        const errorKeys = [
          "user_not_register",
          "user_not_registered_by_credentials",
          "invalid_password",
        ];

        if (res.error === "required_otp") {
          otpTrigger({
            email: data.email,
            password: data.password,
          });
          return;
        }

        if (errorKeys.includes(res.error)) {
          setAlert(t(res.error));
          setLoading(false);
        } else {
          setAlert(t("error_occurred"));
          setLoading(false);
        }
      } else {
        router.push("/app/dashboard");
      }
    } catch (err) {
      setAlert(t("error_occurred"));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email && email.length > 0) {
      setValue("email", email);
    }
  }, [email]);

  return (
    <div>
      {step === componentSteps.LOGIN && (
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
              <InputErrorMessage message={errors.email.message} />
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
              <InputErrorMessage message={errors.password.message} />
            )}
          </div>
          {alert && alert.length > 0 && (
            <div className="w-full max-w-xl">
              <AlertError message={alert} />
            </div>
          )}
          <span
            title="Redefinir senha"
            onClick={onResetPassword}
            className="underline -mt-4 max-w-max ml-auto transition-colors duration-200 hover:text-primary
           text-gray-900 text-sm font-normal p-2 text-end cursor-pointer mb-5 block"
          >
            Esqueceu sua senha?
          </span>
          <button
            title="Start session"
            disabled={loading}
            className="btn btn-primary w-full capitalize"
          >
            {loading && <SubmitButtonLoading />}
            {t("start_session")}
          </button>
          <span
            onClick={() => onCreateAccount()}
            className="text-center underline transition-all duration-300 max-w-max mx-auto block text-sm text-gray-600 hover:text-primary cursor-pointer font-medium mt-5"
          >
            {t("create_account_login")}
          </span>
        </form>
      )}

      {step == componentSteps.OTP && loginData && (
        <OTPComponent email={loginData?.email} password={loginData?.password} />
      )}
    </div>
  );
}
