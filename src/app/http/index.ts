import { clearLocalStorage } from "@/helper/methods/localStorageHelper";
import i18n from "@/i18n";
import axios, { HttpStatusCode } from "axios";
import { toast } from "sonner";

export const http = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url;

    if (error.response) {
      const { status } = error.response;

      // Trata 401 em qualquer rota
      if (status === HttpStatusCode.Unauthorized) {
        window.location.href = `/auth?error=unauthorized`;
        clearLocalStorage();
      }

      // Só mostra toast de erro 500 se NÃO for a rota que queremos ignorar
      const isIgnored500 =
        requestUrl?.includes("/api/user/change-language") &&
        status === HttpStatusCode.InternalServerError;

      if (!isIgnored500 && status === HttpStatusCode.InternalServerError) {
        toast.error(
          i18n?.t("error_occurred") ||
            "An unexpected error occurred. Please try again later."
        );
      }
    }

    return Promise.reject(error);
  }
);
