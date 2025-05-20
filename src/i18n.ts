import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptJson from "./translate/pt.json";
import enJson from "./translate/en.json";

i18n
  //.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptJson },
      en: { translation: enJson },
    },
    lng: "pt", //idioma padrão
    fallbackLng: "pt", //se não encontrar o idioma do navegador, usa esse
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
