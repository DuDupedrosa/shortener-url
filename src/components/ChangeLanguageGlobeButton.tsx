"use client";

import { useTranslation } from "react-i18next";
import { GlobeAltIcon, LanguageIcon } from "@heroicons/react/24/outline";
import USFlag from "@/assets/svg/us-flag.svg";
import BRFlag from "@/assets/svg/br-flag.svg";
import Image from "next/image";
import { LanguageText, LanguageTextEnum } from "@/helper/enums/LanguageEnum";
import { http } from "@/app/http";
import { usePathname } from "next/navigation";

export default function ChangeLanguageGlobeButton() {
  const { i18n } = useTranslation();
  const pathname = usePathname();

  async function changeLang(lng: LanguageText) {
    i18n.changeLanguage(lng);
    window.localStorage.setItem("lang", lng);

    if (pathname.includes("/app")) {
      try {
        await http.patch("/api/user/change-language", { lang: lng });
      } catch (err) {}
    }
  }

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle text-gray-900 bg-transparent border-none hover:bg-gray-200 transition-colors"
      >
        <GlobeAltIcon className="w-8" />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu gap-3 bg-gray-100 border border-gray-400 rounded-box z-10 w-52  p-2 pt-3 shadow-sm"
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
