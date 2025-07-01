import * as React from "react";

interface DeleteAccountEmailTemplateProps {
  firstName: string;
  lang?: "pt" | "en";
}

export const DeleteAccountEmailTemplate: React.FC<
  Readonly<DeleteAccountEmailTemplateProps>
> = ({ firstName, lang = "pt" }) => {
  const texts = {
    pt: {
      greeting: `Olá, ${firstName}.`,
      message:
        "Confirmamos que sua conta no Snipply URL foi excluída com sucesso. Todos os seus dados, incluindo URLs encurtadas e informações pessoais, foram permanentemente removidos de nossos sistemas.",
      farewell:
        "Se um dia quiser voltar a usar o Snipply, estaremos de braços abertos te esperando! Você pode criar uma nova conta quando quiser.",
      buttonText: "Criar nova conta",
      ignore:
        "Se você não solicitou a exclusão desta conta, entre em contato conosco imediatamente.",
      copyright: "© 2025 snipply-url. Todos os direitos reservados.",
      privacyPolicy: "Política de Privacidade",
      privacyLink: "https://www.snipplyurl.com.br/privacy-policy",
    },
    en: {
      greeting: `Hello, ${firstName}.`,
      message:
        "Your Snipply URL account has been successfully deleted. All your data, including shortened URLs and personal information, has been permanently removed from our systems.",
      farewell:
        "If you ever decide to come back, we'll be here with open arms! You're welcome to create a new account anytime.",
      buttonText: "Create New Account",
      ignore:
        "If you did not request this account deletion, please contact us immediately.",
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

      <h1 style={{ color: "#d9534f", marginBottom: "10px" }}>{t.greeting}</h1>

      <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
        {t.message}
      </p>

      <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
        {t.farewell}
      </p>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <a
          href="https://www.snipplyurl.com.br"
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

export default DeleteAccountEmailTemplate;
