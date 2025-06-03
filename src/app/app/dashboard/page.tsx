"use client";

import { http } from "@/app/http";
import EmptyDashboard from "@/components/EmptyDashboard";
import MainHeader from "@/components/MainHeader";
import PageLoading from "@/components/PageLoading";
import { User } from "@/types/user";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserByEmail = async (email: string) => {
      setLoadingUser(true);
      try {
        const userResp = await http.get(
          `/api/user/get-by-email?email=${email}`
        );
        if (userResp && userResp.data && userResp.data.payload) {
          const userData = userResp.data.payload;
          window.localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        } else {
          signOut({ callbackUrl: "/auth?error=unauthorized" });
        }
      } catch (err) {
        signOut({ callbackUrl: "/auth?error=unauthorized" });
      } finally {
        setLoadingUser(false);
      }
    };

    if (session && session.user.email) {
      fetchUserByEmail(session.user.email);
    }
  }, [session]);

  if (status === "loading") return <PageLoading />;

  // Se não está autenticado, a middleware já redirecionou,
  // então aqui é seguro assumir que o user está logado.

  return (
    <div className="min-h-screen bg-gray-100">
      <MainHeader />

      {loadingUser && <PageLoading />}
      {!loadingUser && (
        <div>{user && <EmptyDashboard userName={user.name} />}</div>
      )}
    </div>
  );
}
