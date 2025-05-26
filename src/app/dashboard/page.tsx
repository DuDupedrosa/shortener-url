"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") signIn(); // redireciona para login
  }, [status]);

  if (status === "loading") return <p>Carregando...</p>;

  return (
    <div>
      <div>Bem-vindo, {session?.user?.name}!</div>
      <button onClick={() => signOut({ callbackUrl: "/auth" })}>Sair</button>
    </div>
  );
}
