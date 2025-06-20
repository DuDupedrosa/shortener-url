import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function OTPComponent({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { t } = useTranslation();
  const [code1, setCode1] = useState<string>("");
  const [code2, setCode2] = useState<string>("");
  const [code3, setCode3] = useState<string>("");
  const [code4, setCode4] = useState<string>("");
  const [enabledSubmitButton, setEnableSubmitButton] = useState<boolean>(false);
  const [codeExpiration, setCodeExpiration] = useState(50); // 5 minutos (em segundos)
  const [resendCodeCountdown, setResendCodeCountdown] = useState(0);

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
    let sanitizedValue = value.replace(/\s/g, ""); // remove TODOS os espaços

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
    setCodeExpiration(50);
    startResendCodeCountdown();
  }

  const onSubmit = async () => {};

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
        <span className="font-bold">email@example.com</span>.
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
            O código expirou. Clique em{" "}
            <span
              onClick={handleReSendCode}
              className="underline cursor-pointer text-primary"
            >
              Reenviar
            </span>{" "}
            para receber um novo.
          </p>
        )}

        {codeExpiration > 0 && (
          <p className="text-sm text-center mt-8 font-medium text-gray-900">
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
                Você poderá reenviar o código em{" "}
                <span className="font-bold">{resendCodeCountdown}s</span>
              </span>
            )}
          </p>
        )}

        <button
          disabled={!enabledSubmitButton}
          type="submit"
          title="Enviar código"
          className={`btn btn-primary w-full capitalize mt-8 ${
            !enabledSubmitButton ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
