import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "SnipplyURL - Encurtador de links",
  description: "A forma mais simples e rápida de encurtar URLs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" data-theme="emerald">
      <body className="font-inter">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
