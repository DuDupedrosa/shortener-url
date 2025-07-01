"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function MainFooter({ logged }: { logged?: boolean }) {
  const { t } = useTranslation();

  return (
    <footer
      className={`w-full border-t border-t-gray-200 ${logged ? "bg-gray-100" : "bg-gray-50"} text-base-content`}
    >
      <div className="max-w-6xl mx-auto flex gap-5 flex-col sm:flex-row items-center justify-between px-4 py-4 text-sm text-gray-500">
        <span>
          © {new Date().getFullYear()} SnipplyURL. {t("all_rights_reserved")}.
        </span>
        <Link
          href="/privacy-policy"
          className="underline transition-colors hover:text-primary"
        >
          {t("privacy_policy")}
        </Link>
      </div>
    </footer>
  );
}
