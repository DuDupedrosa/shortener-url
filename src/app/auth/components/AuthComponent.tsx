"use client";

import Image from "next/image";
import TecImage from "@/app/assets/svg/tec-image.svg";
import Logo from "@/app/assets/image/logo.png";
import ChangeLanguage from "@/components/ChangeLanguage";
import { useTranslation } from "react-i18next";
import { signIn } from "next-auth/react";
import SignIn from "./SignIn";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";

const componentStepEnum = {
  SIGN_IN: 1,
  SIGN_UP: 2,
};

export default function AuthComponent() {
  const { t } = useTranslation();
  const [step, setStep] = useState(componentStepEnum.SIGN_IN);
  const [emailRegistered, setEmailRegistered] = useState<string>("");

  useEffect(() => {
    setEmailRegistered("");
  }, []);

  return (
    <div className="h-screen p-8">
      <ChangeLanguage />
      <section className="h-full grid lg:grid-cols-[40%_1fr] gap-8">
        {/* img - only desktop */}
        <div className="h-[99%] hidden lg:block">
          <div className="rounded-lg h-full  bg-gray-200 grid place-items-center">
            <Image src={TecImage} alt="TEC-IMAGE" />
          </div>
        </div>
        {/* auth content (grid) */}
        <div className="h-full grid place-items-center pb-8">
          <div>
            <div className="max-w-[150px] mx-auto">
              <Image className="w-full" src={Logo} alt="snipply-url" />
            </div>
            {/* title + google sign in button */}
            <div className="mb-8">
              <h1 className="text-5xl text-center md:text-start font-grotesk font-semibold text-gray-900 mb-2">
                {t("greeting")}
              </h1>
              <span className="block max-w-lg text-center md:text-start text-lg text-gray-900 mb-8">
                {t("login_subtitle")}
              </span>

              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="btn border-2 w-full lg:w-max  bg-white text-black border-[#e5e5e5]"
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

            {step === componentStepEnum.SIGN_IN && (
              <>
                <SignIn
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
          </div>
        </div>
      </section>
    </div>
  );
}
