import Logo from "@/assets/image/logo.png";
import {
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ChangeLanguageGlobeButton from "./ChangeLanguageGlobeButton";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { clearLocalStorage } from "@/helper/methods/localStorageHelper";

export default function MainHeader({
  anonymousArea,
}: {
  anonymousArea?: boolean;
}) {
  const { t } = useTranslation();
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="navbar min-h-20 bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link
          href={anonymousArea ? "/" : "/app/dashboard"}
          className="flex max-w-max items-center h-12 px-2 hover:opacity-90 transition"
        >
          <Image alt="Snipply-url" src={Logo} className="w-36 object-contain" />
        </Link>
      </div>
      <div className="mr-3">
        <ChangeLanguageGlobeButton />
      </div>

      {!anonymousArea && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div className="sm:hidden">
              <button
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost border border-gray-300 hover:border-gray-400 relative w-14 h-14"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-500" />
                )}
                <ChevronDownIcon className="absolute -bottom-1 -right-1 w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div
              tabIndex={0}
              role="button"
              className="hidden sm:flex items-center gap-2 btn btn-lg px-4 py-2 shadow-sm border border-gray-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-11 h-11 rounded-full"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
              )}

              {user?.name && (
                <span className="text-base font-medium text-gray-700 truncate max-w-[120px]">
                  {user.name}
                </span>
              )}

              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 pt-2 shadow border border-gray-400"
            >
              <li>
                <a
                  onClick={() => router.push("/app/dashboard")}
                  className="flex items-center gap-2"
                >
                  <HomeIcon width={22} />
                  {t("dashboard")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => router.push("/app/profile")}
                  className="flex items-center gap-2"
                >
                  <Cog6ToothIcon width={22} />
                  {t("settings")}
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    clearLocalStorage();
                    signOut({ callbackUrl: "/auth" });
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftEndOnRectangleIcon width={22} />
                  {t("logout")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
