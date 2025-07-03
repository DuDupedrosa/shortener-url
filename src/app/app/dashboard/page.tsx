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
import MainFooter from "@/components/MainFooter";
import { useUser } from "@/app/context/UserContext";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [shorteners, setShorteners] = useState<Shortener[] | []>([]);
  const { i18n } = useTranslation();
  const { updateUser } = useUser();

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
          updateUser(userData);
          fetchShorteners();
        } else {
          signOut({ callbackUrl: "/auth?error=unauthorized" });
        }
      } catch (err) {
        signOut({ callbackUrl: "/auth?error=unauthorized" });
      }
    };

    if (session && session.user) {
      if (!user) {
        fetchUserByEmail();
      }
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {(loading || !user) && <PageLoading />}

      {!loading && user && (
        <>
          <MainHeader />

          <div className="flex-grow">
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

          <MainFooter logged={true} />
        </>
      )}
    </div>
  );
}
