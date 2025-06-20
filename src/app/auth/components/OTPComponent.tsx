import { HttpStatusEnum } from "@/app/api/helpers/enums/HttpStatusEnum";
import { http } from "@/app/http";
import AlertError from "@/components/AlertError";
import { AxiosError, HttpStatusCode } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function OTPComponent({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { t, i18n } = useTranslation();
  const [code1, setCode1] = useState<string>("");
  const [code2, setCode2] = useState<string>("");
  const [code3, setCode3] = useState<string>("");
  const [code4, setCode4] = useState<string>("");
  const [enabledSubmitButton, setEnableSubmitButton] = useState<boolean>(false);
  const [codeExpiration, setCodeExpiration] = useState(300); // 5 minutos (em segundos)
  const [resendCodeCountdown, setResendCodeCountdown] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [reSendCodeLoading, setReSendCodeLoading] = useState<boolean>(false);

  function cleanValues() {
    setCode1("");
    setCode2("");
    setCode3("");
    setCode4("");

    const code1 = document.getElementById("code_1");

    if (code1) {
      code1.focus();
    }
  }

  function startResendCodeCountdown(duration = 60) {
    setResendCodeCountdown(duration);
    const interval = setInterval(() => {
      setResendCodeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function limitCaractere(value: string) {
    setErrorMessage("");
    let sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    if (sanitizedValue.length > 1) {
      sanitizedValue = value.slice(0, 1);
    }

    return sanitizedValue;
  }

  function handleCopyCode(code: string) {
    const sanitizedValue = code.replace(/\s/g, ""); // remove TODOS os espaços

    if (sanitizedValue && sanitizedValue.length === 4) {
      setCode1(sanitizedValue.slice(0, 1));
      setCode2(sanitizedValue.slice(1, 2));
      setCode3(sanitizedValue.slice(2, 3));
      setCode4(sanitizedValue.slice(3, 4));
    }
  }

  async function handleReSendCode() {
    setReSendCodeLoading(true);
    try {
      let payload = { lang: i18n.language, email, password };
      await http.post("/api/otp/send", payload);
      cleanValues();
      setErrorMessage("");
      setCodeExpiration(300);
      startResendCodeCountdown();
      toast.success("Código reenviado com sucesso");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response &&
          err.response.status !== HttpStatusCode.InternalServerError
        ) {
          toast.error(t("error_occurred"));
        }
      }
    } finally {
      setReSendCodeLoading(false);
    }
  }

  const onSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      let payload = {
        email,
        password,
        code: `${code1}${code2}${code3}${code4}`,
      };

      await http.post("/api/otp/validate", payload);
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res?.error) {
        toast.error(t("error_occurred"));
      } else {
        toast.success(t("email_success_validate"));
        router.push("/app/dashboard");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response &&
          err.response.status === HttpStatusEnum.BAD_REQUEST
        ) {
          const message = err.response.data.message;
          if (message === "expired_code") {
            cleanValues();
          }
          setEnableSubmitButton(false);
          setErrorMessage(message);
          toast.error(t(message));
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code1 && code2 && code3 && code4) {
      setEnableSubmitButton(true);
    } else {
      setEnableSubmitButton(false);
    }
  }, [code1, code2, code3, code4]);

  useEffect(() => {
    if (code1) {
      const code2 = document.getElementById("code_2");
      code2?.focus();
    }
  }, [code1]);

  useEffect(() => {
    if (code2) {
      const code3 = document.getElementById("code_3");
      code3?.focus();
    }
  }, [code2]);

  useEffect(() => {
    if (code3) {
      const code4 = document.getElementById("code_4");
      code4?.focus();
    }
  }, [code3]);

  useEffect(() => {
    if (!codeExpiration) return;

    const timer = setInterval(() => {
      setCodeExpiration((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [codeExpiration]);

  return (
    <div>
      <h2 className="text-center mb-2 text-3xl font-medium text-gray-900">
        Verifique seu email
      </h2>

      <p className="text-base font-normal max-w-lg text-center text-gray-900">
        Por favor, informe nos campos abaixo o código que enviamos para o email:{" "}
        <span className="font-bold">{email}</span>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!enabledSubmitButton) return;
          // lógica de envio aqui
        }}
        className="mt-5"
      >
        <div className="flex gap-5 justify-center">
          {[code1, code2, code3, code4].map((code, idx) => (
            <input
              key={idx}
              type="text"
              id={`code_${idx + 1}`}
              aria-label={`Código parte ${idx + 1}`}
              autoFocus={idx === 0}
              value={code}
              onChange={(e) => {
                const value = e.target.value;
                handleCopyCode(value);
                if (value.length !== 4) {
                  [setCode1, setCode2, setCode3, setCode4][idx](
                    limitCaractere(value)
                  );
                }
              }}
              className="input input-bordered w-12 h-12 text-center text-xl font-mono"
            />
          ))}
        </div>

        {codeExpiration > 0 ? (
          <p className="text-sm text-center mt-3 text-gray-600">
            O código expira em{" "}
            <span className="font-semibold text-primary">
              {String(Math.floor(codeExpiration / 60)).padStart(2, "0")}:
              {String(codeExpiration % 60).padStart(2, "0")}
            </span>
          </p>
        ) : (
          <p className="text-sm text-center mt-3 text-red-600 font-medium">
            O código expirou.
            <br />
            <button onClick={handleReSendCode} className="btn btn-primary mt-2">
              Reenviar Código
            </button>
          </p>
        )}

        {reSendCodeLoading && (
          <p className="text-sm flex justify-center items-center gap-2 text-center mt-8 font-medium text-gray-900">
            Reenviando código
            <span className="loading loading-spinner text-primary"></span>
          </p>
        )}

        {codeExpiration > 0 && !reSendCodeLoading && (
          <p className="text-sm text-center mt-8 font-medium text-gray-900 max-w-lg">
            {!resendCodeCountdown ? (
              <>
                Não recebeu o código?{" "}
                <button
                  onClick={handleReSendCode}
                  type="button"
                  className="text-primary font-bold underline cursor-pointer transition-colors hover:text-green-600"
                >
                  Reenviar
                </button>
              </>
            ) : (
              <span className="text-gray-500">
                Código reenviado com sucesso! Caso precise, você poderá reenviar
                um novo código em:{" "}
                <span className="font-bold">{resendCodeCountdown}s</span>
              </span>
            )}
          </p>
        )}

        {errorMessage && errorMessage.length > 0 && (
          <AlertError message={t(errorMessage)} />
        )}

        <button
          disabled={!enabledSubmitButton || loading}
          type="submit"
          title="Enviar código"
          className={`btn btn-primary w-full capitalize mt-8 ${
            !enabledSubmitButton ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={onSubmit}
        >
          {loading && <span className="loading loading-spinner"></span>}
          Enviar
        </button>
      </form>
    </div>
  );
}
