"use client";

import { useEffect, useState } from "react";
import { whatsappUrl } from "@/content/site";

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
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="grid size-12 shrink-0 place-items-center rounded-full border border-ink-line text-white"
          aria-label="Chamar no WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
