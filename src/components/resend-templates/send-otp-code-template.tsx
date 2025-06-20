import * as React from "react";

interface SendOtpCodeTemplateProps {
  firstName: string;
  code: string;
  lang?: "pt" | "en";
}

export const SendOtpCodeTemplate: React.FC<
  Readonly<SendOtpCodeTemplateProps>
> = ({ firstName, code, lang = "pt" }) => {
  const texts = {
    pt: {
      greeting: `Olá, ${firstName}!`,
      instruction:
        "Para confirmar seu e-mail, insira o código de verificação abaixo no aplicativo:",
      codeLabel: "Seu código de verificação:",
      validity: "Este código é válido por apenas 5 minutos.",
      ignore: "Se você não solicitou esta verificação, ignore este e-mail.",
      copyright: "© 2025 snipply-url. Todos os direitos reservados.",
      privacyPolicy: "Política de Privacidade",
      privacyLink: "https://www.snipplyurl.com.br/politica-privacidade",
    },
    en: {
      greeting: `Hello, ${firstName}!`,
      instruction:
        "To confirm your email, please enter the verification code below in the app:",
      codeLabel: "Your verification code:",
      validity: "This code is only valid for 5 minutes.",
      ignore:
        "If you did not request this verification, please ignore this email.",
      copyright: "© 2025 snipply-url. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      privacyLink: "https://www.snipplyurl.com.br/politica-privacidade",
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

      <div
        style={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "bold",
          letterSpacing: "8px",
          margin: "30px 0",
          color: "#3AA655",
        }}
      >
        {code}
      </div>

      <p
        style={{
          fontSize: "14px",
          color: "#666",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {t.validity}
      </p>

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

export default SendOtpCodeTemplate;
