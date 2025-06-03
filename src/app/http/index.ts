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
    if (error.response) {
      const { status } = error.response;

      if (status === HttpStatusCode.InternalServerError) {
        toast.error(
          i18n?.t("error_occurred") ||
            "An unexpected error occurred. Please try again later."
        );
      }

      if (status === HttpStatusCode.Unauthorized) {
        window.location.href = `/auth?error=unauthorized`;
        window.localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);
