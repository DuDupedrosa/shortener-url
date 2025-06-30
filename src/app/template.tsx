"use client";

import { LanguageText, LanguageTextEnum } from "@/helper/enums/LanguageEnum";
import { isValidLanguage } from "@/helper/methods/languageHelper";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = window.localStorage.getItem("lang");

    if (lang && isValidLanguage(lang) && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, []);

  return <>{children}</>;
}
