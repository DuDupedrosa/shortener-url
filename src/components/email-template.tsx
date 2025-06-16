import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
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
        src="https://i.imgur.com/YNLBT1W.png"
        alt="Snipply URL"
        width={120}
      />
    </div>

    <h1 style={{ color: "#3AA655", marginBottom: "10px" }}>
      Olá, {firstName}!
    </h1>
    <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
      Bem-vindo ao Snipply URL! Agora você pode começar a encurtar, editar e
      gerenciar seus links de forma rápida e prática.
    </p>

    <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#111111" }}>
      Clique no botão abaixo para acessar seu painel e começar a usar:
    </p>

    <div style={{ textAlign: "center", marginBottom: "40px" }}>
      <a
        href="https://shortener-url.vercel.app/app/dashboard"
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
        Começar Agora
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
      Se você não solicitou essa conta, ignore este e-mail.
    </p>

    <footer style={{ fontSize: "12px", color: "#999", textAlign: "center" }}>
      © 2025 snipply-url. Todos os direitos reservados.
      <br />
      <a
        href="https://shortener-url.vercel.app/politica-privacidade"
        style={{ color: "#999", textDecoration: "underline" }}
      >
        Política de Privacidade
      </a>
    </footer>
  </div>
);

export default EmailTemplate;
