export const clearLocalStorage = () => {
  const lang = window.localStorage.getItem("lang");
  window.localStorage.clear();
  if (lang) window.localStorage.setItem("lang", lang);
};
