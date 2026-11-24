"use client";

import { useEffect, useState } from "react";
import { contato, emailUrl } from "@/content/site";

// Barra fixa no celular: aparece depois do hero e some quando o contato esta na tela.
export function CtaMovel() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const contato = document.getElementById("contato");
    let passouHero = false;
    let noContato = false;
    const sync = () => setVisivel(passouHero && !noContato);
    const onScroll = () => {
      passouHero = window.scrollY > window.innerHeight * 0.8;
      sync();
    };
    const io = new IntersectionObserver(([e]) => {
      noContato = e.isIntersecting;
      sync();
    });
    if (contato) io.observe(contato);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${visivel ? "translate-y-0" : "translate-y-[120%]"}`}
      aria-hidden={!visivel}
      inert={!visivel}
    >
      <div className="flex gap-2 rounded-full bg-ink p-1.5 shadow-[0_20px_40px_-12px_rgba(15,20,32,.6)]">
        <a href="#contato" className="flex flex-1 items-center justify-center rounded-full bg-cyan py-3 text-[15px] font-semibold text-ink">
          Fale com um especialista
        </a>
        <a
          href={emailUrl()}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-ink-line text-white"
          aria-label={`Escrever para ${contato.email}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
