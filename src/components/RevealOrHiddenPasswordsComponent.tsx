import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function RevealOrHiddenPasswordsComponent({
  showPasswords,
  handlePassword,
}: {
  showPasswords: boolean;
  handlePassword: (newValue: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-end -mt-2">
      <button
        type="button"
        onClick={() => handlePassword(!showPasswords)}
        className="p-1 flex items-center gap-2 text-sm cursor-pointer text-gray-600 underline transition-colors duration-200 hover:text-green-600"
      >
        {showPasswords ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="w-h h-5" />
        )}
        {showPasswords ? t("hidden_passwords") : t("reveal_passwords")}
      </button>
    </div>
  );
}
