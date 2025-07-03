"use client";

import Image from "next/image";
import Logo from "@/assets/image/logo.png";
import ChangeLanguage from "@/components/ChangeLanguage";
import { useTranslation } from "react-i18next";
import { signIn } from "next-auth/react";
import SignIn from "./SignIn";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ResetPassword from "./ResetPassword";
import { clearLocalStorage } from "@/helper/methods/localStorageHelper";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const componentStepEnum = {
  SIGN_IN: 1,
  SIGN_UP: 2,
  RESET_PASSWORD: 3,
};

export default function AuthComponent() {
  const { t } = useTranslation();
  const [step, setStep] = useState(componentStepEnum.SIGN_IN);
  const [emailRegistered, setEmailRegistered] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setEmailRegistered("");
  }, []);

  useEffect(() => {
    if (
      searchParams.get("error") &&
      searchParams.get("error") === "unauthorized"
    ) {
      clearLocalStorage();
      router.replace("/auth", { scroll: false });
      setTimeout(() => {
        toast.error(t("unauthorized"));
      }, 100);
    }

    if (
      searchParams.get("deleteAccount") &&
      searchParams.get("deleteAccount") === "success"
    ) {
      clearLocalStorage();
      router.replace("/auth", { scroll: false });
      setTimeout(() => {
        toast.success(t("account_deleted_success"));
      }, 100);
    }

    if (
      searchParams.get("changePassword") &&
      searchParams.get("changePassword") === "success"
    ) {
      clearLocalStorage();
      router.replace("/auth", { scroll: false });
      setTimeout(() => {
        toast.success(t("password_changed_success"));
      }, 100);
    }
  }, [searchParams]);

  return (
    <section className="rounded-2xl shadow-xl w-full max-w-[584px] shadow-gray-200 bg-white p-5 px-8  border border-primary">
      {step !== componentStepEnum.RESET_PASSWORD && (
        <ArrowRightOnRectangleIcon className="w-14 text-primary mx-auto my-8" />
      )}
      {/* title + google sign in button */}
      {step !== componentStepEnum.RESET_PASSWORD && (
        <>
          <div className="mb-8">
            <h1 className="text-4xl text-center font-grotesk font-semibold text-gray-900 mb-2">
              {t("greeting")}
            </h1>
            <span className="block max-w-lg text-center  text-base text-gray-900 mb-8">
              {t("login_subtitle")}
            </span>

            <button
              onClick={() =>
                signIn("google", { callbackUrl: "/app/dashboard" })
              }
              className="btn transition-all duration-100 hover:bg-gray-100 shadow border-2 w-full lg:w-max  bg-white text-black border-[#e5e5e5]"
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              {t("login_google")}
            </button>
          </div>
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-500" />
            <span className="mx-4 text-sm font-medium text-gray-800">
              {t("or_continue_with")}:
            </span>
            <div className="flex-grow h-px bg-gray-500" />
          </div>
        </>
      )}

      {step === componentStepEnum.SIGN_IN && (
        <>
          <SignIn
            onResetPassword={() => {
              setStep(componentStepEnum.RESET_PASSWORD);
            }}
            email={emailRegistered}
            onCreateAccount={() => {
              setStep(componentStepEnum.SIGN_UP);
              setEmailRegistered("");
            }}
          />
        </>
      )}
      {step === componentStepEnum.SIGN_UP && (
        <>
          <SignUp
            onResetPassword={() => {
              setStep(componentStepEnum.RESET_PASSWORD);
            }}
            onRegister={(email: string) => {
              setEmailRegistered(email);
              setStep(componentStepEnum.SIGN_IN);
            }}
            onSignIn={() => {
              setStep(componentStepEnum.SIGN_IN);
              setEmailRegistered("");
            }}
          />
        </>
      )}
      {step === componentStepEnum.RESET_PASSWORD && (
        <>
          <ResetPassword
            onSignIn={() => {
              setStep(componentStepEnum.SIGN_IN);
            }}
          />
        </>
      )}
    </section>
  );
}
