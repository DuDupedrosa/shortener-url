import { Suspense } from "react";
import RedirectComponent from "./components/RedirectComponent";

export default function page() {
  return (
    <Suspense fallback={null}>
      <RedirectComponent />
    </Suspense>
  );
}
