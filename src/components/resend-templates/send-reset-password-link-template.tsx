import * as React from "react";

interface SendResetPasswordTemplateProps {
  resetLink: string;
  lang?: "pt" | "en";
}

export const SendResetPasswordTemplate: React.FC<
  Readonly<SendResetPasswordTemplateProps>
> = ({ resetLink, lang = "pt" }) => {
  const texts = {
    pt: {
      greeting: `Olá!`,
      instruction:
        "Recebemos uma solicitação para redefinir sua senha. Para continuar, clique no botão abaixo:",
      button: "Redefinir senha",
      linkInstruction: "Ou copie e cole o link abaixo no seu navegador:",
      ignore:
        "Se você não solicitou essa redefinição, ignore este e-mail com segurança.",
      copyright: "© 2025 snipply-url. Todos os direitos reservados.",
      privacyPolicy: "Política de Privacidade",
      privacyLink: "https://www.snipplyurl.com.br/privacy-policy",
    },
    en: {
      greeting: `Hello!`,
      instruction:
        "We received a request to reset your password. To proceed, click the button below:",
      button: "Reset Password",
      linkInstruction: "Or copy and paste the link below into your browser:",
      ignore:
        "If you didn’t request this reset, feel free to ignore this email.",
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
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
          src="https://asexxakbtklndtzuiwhz.supabase.co/storage/v1/object/public/public-images/logo_sm_email.png"
          alt="Snipply URL"
          width={120}
        />
      </div>

      <h1 style={{ color: "#3AA655", marginBottom: "10px" }}>{t.greeting}</h1>

      <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
        {t.instruction}
      </p>

      {/* Botão */}
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <a
          href={resetLink}
          style={{
            display: "inline-block",
            backgroundColor: "#3AA655",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          {t.button}
        </a>
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#444",
          marginBottom: "10px",
          wordBreak: "break-all",
        }}
      >
        {t.linkInstruction}
        <br />
        <a href={resetLink} style={{ color: "#3AA655" }}>
          {resetLink}
        </a>
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        {t.ignore}
      </p>

      <footer
        style={{
          fontSize: "12px",
          color: "#999",
          textAlign: "center",
          marginTop: "30px",
        }}
      >
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

export default SendResetPasswordTemplate;
