import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function InputErrorMessage({
  message,
}: {
  message: string | undefined;
}) {
  return (
    <>
      {message && (
        <span className="input-error-message">
          <ExclamationTriangleIcon />
          {message}
        </span>
      )}
    </>
  );
}
