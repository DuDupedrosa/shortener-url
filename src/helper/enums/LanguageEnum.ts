export const LanguageTextEnum = {
  PT: "pt",
  EN: "en",
} as const;
export type LanguageText =
  (typeof LanguageTextEnum)[keyof typeof LanguageTextEnum];
