"use client";

import MainFooter from "@/components/MainFooter";
import MainHeader from "@/components/MainHeader";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainHeader anonymousArea={true} />

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Encurte suas URLs com facilidade
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          O <strong>SnipplyURL</strong> é uma ferramenta simples e gratuita para
          transformar links longos em URLs curtas e práticas.
        </p>

        <Link href="/create">
          <button className="btn btn-primary btn-lg">Comece agora</button>
        </Link>

        <div className="mt-12 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Como funciona</h2>
          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-primary">Cole sua URL</li>
            <li className="step step-primary">Clique em "Encurtar"</li>
            <li className="step step-primary">Compartilhe o link</li>
          </ul>
        </div>
      </main>

      <MainFooter />
    </div>
  );
}
