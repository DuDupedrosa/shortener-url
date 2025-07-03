"use client";

import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import PageLoading from "@/components/PageLoading";
import SubmitButtonLoading from "@/components/SubmitButtonLoading";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: session, status } = useSession();
  const [anonymousUser, setAnonymousUser] = useState<boolean>(true);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user) {
      setAnonymousUser(false);
    }
  }, [session]);

  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader anonymousArea={anonymousUser} />

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {t("home_title")}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          {t("the")} <strong>SnipplyURL</strong> {t("home_description")}
        </p>

        <button
          disabled={status === "loading"}
          onClick={() =>
            router.push(anonymousUser ? "/auth" : "/app/dashboard")
          }
          className="btn btn-primary btn-lg"
        >
          {status === "loading" && <SubmitButtonLoading />}
          {anonymousUser ? t("start_now") : t("access_platform")}
        </button>

        <div className="mt-12 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">{t("how_its_work")}</h2>
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-primary">{t("paste_your_url")}</li>
            <li className="step step-primary">{t("click_short")}</li>
            <li className="step step-primary">{t("share_link")}</li>
          </ul>
        </div>
        <div className="mt-12 w-full max-w-2xl aspect-video hidden md:block">
          <video
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src="/snipplyurl-preview.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <div className="mt-12 w-full max-w-2xl h-[80vh] block md:hidden">
          <video
            className="w-full h-full object-cover rounded-lg shadow-lg"
            src="/snipplyurl-preview-mobile.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
