import * as React from "react";

interface WemcolmeEmailTemplateProps {
  firstName: string;
  lang?: "pt" | "en";
}

export const WelcomeEmailTemplate: React.FC<
  Readonly<WemcolmeEmailTemplateProps>
> = ({ firstName, lang = "pt" }) => {
  const texts = {
    pt: {
      greeting: `Olá, ${firstName}!`,
      welcome:
        "Bem-vindo ao Snipply URL! Agora você pode começar a encurtar, editar e gerenciar seus links de forma rápida e prática.",
      callToAction:
        "Clique no botão abaixo para acessar seu painel e começar a usar:",
      buttonText: "Começar Agora",
      ignore: "Se você não solicitou essa conta, ignore este e-mail.",
      copyright: "© 2025 snipply-url. Todos os direitos reservados.",
      privacyPolicy: "Política de Privacidade",
      privacyLink: "https://www.snipplyurl.com.br/privacy-policy",
    },
    en: {
      greeting: `Hello, ${firstName}!`,
      welcome:
        "Welcome to Snipply URL! Now you can start shortening, editing, and managing your links quickly and easily.",
      callToAction:
        "Click the button below to access your dashboard and get started:",
      buttonText: "Get Started",
      ignore: "If you did not request this account, please ignore this email.",
      copyright: "© 2025 snipply-url. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      privacyLink: "https://www.snipplyurl.com.br/privacy-policy",
    },
  };

  const t = texts[lang];

  return (
    <div
      style={{
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: "#f4f6f8",
        padding: "30px 20px",
        borderRadius: "10px",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#333",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo no topo */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
          src="https://asexxakbtklndtzuiwhz.supabase.co/storage/v1/object/public/public-images/logo_sm_email.png"
          alt="Snipply URL"
          width={120}
        />
      </div>

      <h1 style={{ color: "#3AA655", marginBottom: "10px" }}>{t.greeting}</h1>

      <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
        {t.welcome}
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
        {t.callToAction}
      </p>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <a
          href="https://www.snipplyurl.com.br/app/dashboard"
          style={{
            backgroundColor: "#3AA655",
            color: "#fff",
            padding: "14px 30px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "18px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            display: "inline-block",
            transition: "background-color 0.3s ease",
          }}
        >
          {t.buttonText}
        </a>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {t.ignore}
      </p>

      <footer style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>
        {t.copyright}
        <br />
        <a
          href={t.privacyLink}
          style={{ color: "#999", textDecoration: "underline" }}
        >
          {t.privacyPolicy}
        </a>
      </footer>
    </div>
  );
};

export default WelcomeEmailTemplate;
