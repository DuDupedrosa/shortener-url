import { redirect } from "next/navigation";
import { PageProps } from "../../../../.next/types/app/to/[slug]/page";

export default async function page(props: PageProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;

  const res = await fetch(
    `${baseUrl}/api/shortener/get-original-url?label=${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const erroKey = res.status === 404 ? 404 : 503;
    redirect(`/redirect-not-found?key=${slug}&errorKey=${erroKey}`);
  }

  const json = await res.json();
  const originalUrl = json?.payload;

  if (!originalUrl) {
    redirect("/not-found");
  }

  redirect(originalUrl);
}
