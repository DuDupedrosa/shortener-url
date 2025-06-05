import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorInputMessage({ message }: { message: string }) {
  return (
    <span className="input-error-message text-start">
      <ExclamationTriangleIcon />
      {message}
    </span>
  );
}
