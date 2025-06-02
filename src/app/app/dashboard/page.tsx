"use client";

import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Carregando...</p>;

  // Se não está autenticado, a middleware já redirecionou,
  // então aqui é seguro assumir que o user está logado.

  return (
    <div>
      <div>Bem-vindo, {session?.user?.name}!</div>
      <button onClick={() => signOut({ callbackUrl: "/auth" })}>Sair</button>
    </div>
  );
}
