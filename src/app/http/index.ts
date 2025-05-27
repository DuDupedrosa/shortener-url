import i18n from "@/i18n";
import axios from "axios";
import { toast } from "sonner";

export const http = axios.create({
  headers: {
    "Content-Type": 'application/json"',
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 500) {
      toast.error(
        i18n?.t("error_occurred") ||
          "An unexpected error occurred. Please try again later."
      );
    }
    return Promise.reject(error);
  }
);
