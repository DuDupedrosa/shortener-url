const pt = "pt";
const en = "en";

export function getLang(lang: any): "pt" | "en" {
  if (lang && typeof lang === "string" && lang.length > 0) {
    if (lang === pt) {
      return pt;
    }

    if (lang === en) {
      return en;
    }
  }

  return pt;
}
