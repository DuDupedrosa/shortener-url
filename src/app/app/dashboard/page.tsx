"use client";

import { http } from "@/app/http";
import EmptyDashboard from "@/app/app/dashboard/components/EmptyDashboard";
import MainHeader from "@/components/MainHeader";
import PageLoading from "@/components/PageLoading";
import { User } from "@/types/user";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardComponent from "./components/DashboardComponent";
import { Shortener } from "@/types/shortener";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [shorteners, setShorteners] = useState<Shortener[] | []>([]);
  const { i18n } = useTranslation();

  const fetchShorteners = async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/api/shortener/get-all");
      setShorteners(data.payload);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserByEmail = async () => {
      setLoading(true);
      try {
        const userResp = await http.get(`/api/user/get-by-email`);
        if (userResp && userResp.data && userResp.data.payload) {
          const userData = userResp.data.payload;
          window.localStorage.setItem("user", JSON.stringify(userData));
          window.localStorage.setItem("lang", userData.lang);
          i18n.changeLanguage(userData.lang);
          setUser(userData);
        } else {
          signOut({ callbackUrl: "/auth?error=unauthorized" });
        }
      } catch (err) {
        signOut({ callbackUrl: "/auth?error=unauthorized" });
      }
    };

    if (session && session.user) {
      fetchUserByEmail();
      fetchShorteners();
    }
  }, [session]);

  if (status === "loading") return <PageLoading />;

  // Se não está autenticado, a middleware já redirecionou,
  // então aqui é seguro assumir que o user está logado.

  return (
    <div className="min-h-screen  bg-gray-50">
      {loading && <PageLoading />}
      {!loading && user && (
        <div>
          <MainHeader />

          {shorteners && shorteners.length > 0 && (
            <DashboardComponent
              onReFetch={() => fetchShorteners()}
              userName={user.name}
              shorteners={shorteners}
            />
          )}

          {(!shorteners || shorteners.length <= 0) && (
            <EmptyDashboard
              userName={user.name}
              onCreateShortener={() => fetchShorteners()}
            />
          )}
        </div>
      )}
    </div>
  );
}
