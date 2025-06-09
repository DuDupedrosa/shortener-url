import { copyToClipBoard } from "@/helper/methods/copyToClipBoard";
import { formatDateWithTime } from "@/helper/methods/formatDate";
import { getShortenerUrl } from "@/helper/methods/getShortenerUrl";
import { Shortener } from "@/types/shortener";
import {
  PencilSquareIcon,
  TrashIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function ShortenerCard({ shortener }: { shortener: Shortener }) {
  const { t, i18n } = useTranslation();

  return (
    <div className="w-full sm:w-[350px] min-h-[180px] bg-white shadow-sm rounded-xl p-4 flex flex-col gap-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div>
        <span className="text-xs text-gray-500 font-semibold">
          {t("shortener_url")}
        </span>

        <div className="flex items-center justify-between bg-green-100 px-3 py-2 rounded-md">
          <a
            rel="noopener noreferrer"
            title={t("open_new_window")}
            href={getShortenerUrl(shortener.label)}
            target="_blank"
            className="text-sm text-green-700 font-medium hover:underline truncate"
          >
            {getShortenerUrl(shortener.label)}
          </a>
          <div className="tooltip tooltip-left" data-tip={t("copy")}>
            <button
              onClick={() =>
                copyToClipBoard(
                  getShortenerUrl(shortener.label),
                  t("copied_success")
                )
              }
              className="btn btn-sm btn-ghost text-green-700 hover:bg-green-200 hover:text-green-900"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-gray-500">
          {t("original_url")}
        </span>

        <div className="flex items-center justify-between gap-2">
          <a
            rel="noopener noreferrer"
            title={t("open_new_window")}
            href={shortener.originalUrl}
            target="_blank"
            className="text-sm text-gray-700 truncate hover:underline"
          >
            {shortener.originalUrl}
          </a>

          <div className="tooltip tooltip-left" data-tip={t("copy")}>
            <button
              onClick={() =>
                copyToClipBoard(shortener.originalUrl, t("copied_success"))
              }
              className="btn btn-sm btn-ghost text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            >
              <ClipboardIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 flex flex-col gap-0.5">
        <span>
          <span className="font-semibold">{t("created_at")}:</span>{" "}
          {formatDateWithTime(shortener.createAt, i18n.language)}
        </span>
        <span>
          <span className="font-semibold">{t("last_update")}:</span>{" "}
          {formatDateWithTime(shortener.updateAt, i18n.language)}
        </span>
      </div>

      <div className="flex justify-end gap-1 mt-1">
        <button
          title={t("edit")}
          className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white transition-colors border-none"
        >
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          title={t("delete")}
          className="btn btn-sm bg-red-500 hover:bg-red-600 text-white transition-colors border-none"
        >
          <TrashIcon className="h-5 w-5r" />
        </button>
      </div>
    </div>
  );
}
