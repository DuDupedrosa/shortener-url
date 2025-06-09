import { toast } from "sonner";

export const copyToClipBoard = async (item: any, message: string) => {
  return navigator.clipboard
    .writeText(String(item))
    .then(() => {
      toast.success(message);
    })
    .catch((err) => {});
};
