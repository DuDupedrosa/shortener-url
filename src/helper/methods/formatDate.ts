import { format } from "date-fns";
import { LanguageTextEnum } from "../enums/LanguageEnum";

const getDefaultDateMaskByLanguage = (lang: string) => {
  return lang === LanguageTextEnum.PT ? "dd/MM/yyyy" : "MM/dd/yyyy";
};

const getDefaultDateMaskWithTimeByLanguage = (lang: string) => {
  return lang === LanguageTextEnum.PT
    ? "dd/MM/yyyy - HH:mm"
    : "MM/dd/yyyy - HH:mm";
};

export const formatDate = (
  date: string | Date,
  lang: string,
  mask?: string
) => {
  const dateMask = mask ?? getDefaultDateMaskByLanguage(lang);
  return date ? format(date, dateMask) : "-";
};

export const formatDateWithTime = (
  date: string | Date,
  lang: string,
  mask?: string
) => {
  const dateMask = mask ?? getDefaultDateMaskWithTimeByLanguage(lang);
  return date ? format(date, dateMask) : "-";
};
