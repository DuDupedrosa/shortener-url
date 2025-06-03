"use client";

import { useTranslation } from "react-i18next";
import { LanguageIcon } from "@heroicons/react/24/outline";
import USFlag from "@/assets/svg/us-flag.svg";
import BRFlag from "@/assets/svg/br-flag.svg";
import Image from "next/image";
import { LanguageText, LanguageTextEnum } from "@/helper/enums/LanguageEnum";

export default function ChangeLanguage() {
  const { i18n } = useTranslation();

  function changeLang(lng: LanguageText) {
    i18n.changeLanguage(lng);
  }

  return (
    <div className="dropdown dropdown-end dropdown-hover absolute z-50 right-5">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline btn-primary m-1 hover:text-white text-primary flex items-center gap-2"
      >
        <LanguageIcon className="w-6 h-6" />
        {i18n.language.toUpperCase()}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu gap-3 bg-gray-100 border border-primary rounded-box z-10 w-52 p-2 shadow-sm"
      >
        <li
          className={
            i18n.language === LanguageTextEnum.PT
              ? "bg-primary text-white rounded-lg"
              : ""
          }
          onClick={() => changeLang(LanguageTextEnum.PT)}
        >
          <a className="flex items-center gap-2 cursor-pointer">
            <Image src={BRFlag} alt="BR" width={24} height={16} />
            Português - BR
          </a>
        </li>
        <li
          className={
            i18n.language === LanguageTextEnum.EN
              ? "bg-primary rounded-lg text-white"
              : ""
          }
          onClick={() => changeLang(LanguageTextEnum.EN)}
        >
          <a className="flex items-center gap-2 cursor-pointer">
            <Image src={USFlag} alt="US" width={24} height={16} />
            English - US
          </a>
        </li>
      </ul>
    </div>
  );
}
