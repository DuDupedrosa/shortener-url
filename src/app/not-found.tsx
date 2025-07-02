"use client";

import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import PageLoading from "@/components/PageLoading";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NoFoundImage from "@/assets/svg/not-found-page.svg";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { data: session, status } = useSession();
  const [anonymousUser, setAnonymousUser] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (session?.user) {
      setAnonymousUser(false);
    }
  }, [session]);

  if (status === "loading") return <PageLoading />;

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <MainHeader anonymousArea={anonymousUser} />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12 space-y-6">
        <Image
          src={NoFoundImage}
          alt={t("page_not_found_title")}
          className="max-w-xs md:max-w-md"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-base-content/80">
          {t("page_not_found_title")}
        </h1>
        <p className="text-lg md:text-xl text-base-content/80 max-w-md">
          {t("page_not_found_description")}
        </p>
        <Link
          title={t("back_home")}
          href={anonymousUser ? "/" : "/app/dashboard"}
          className="btn btn-primary btn-lg"
        >
          {t("back_home")}
        </Link>
      </main>

      <MainFooter />
    </div>
  );
}
