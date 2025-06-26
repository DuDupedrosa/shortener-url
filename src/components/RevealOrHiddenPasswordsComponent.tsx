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
    <div className="text-right -mt-2">
      <button
        type="button"
        onClick={() => handlePassword(!showPasswords)}
        className="p-1 text-sm cursor-pointer text-gray-600 underline transition-colors duration-200 hover:text-green-600"
      >
        {showPasswords ? t("hidden_passwords") : t("reveal_passwords")}
      </button>
    </div>
  );
}
