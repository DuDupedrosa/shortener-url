import { LanguageText, LanguageTextEnum } from "../enums/LanguageEnum";

export const isValidLanguage = (lang: string): lang is LanguageText => {
  return Object.values(LanguageTextEnum).includes(lang as LanguageText);
};
