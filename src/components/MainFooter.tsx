"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function MainFooter({ logged }: { logged?: boolean }) {
  const { t } = useTranslation();

  return (
    <footer
      className={`w-full border-t border-t-gray-200 ${
        logged ? "bg-gray-100" : "bg-gray-50"
      } text-base-content`}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 text-sm text-gray-500">
        <span>
          © {new Date().getFullYear()} SnipplyURL. {t("all_rights_reserved")}.
        </span>

        <Link
          href="/privacy-policy"
          className="underline transition-colors hover:text-primary"
        >
          {t("privacy_policy")}
        </Link>

        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/eduardo-pedrosa-946787259/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-800 transition-colors text-blue-600 text-xl"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/DuDupedrosa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors text-gray-900 text-xl"
            aria-label="GitHub"
            title="GitHub"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
