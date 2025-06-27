// app/providers.tsx
"use client";

import React from "react";
import "../i18n"; // inicializa o i18n
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./context/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <UserProvider>{children}</UserProvider>
      </I18nextProvider>
    </SessionProvider>
  );
}
