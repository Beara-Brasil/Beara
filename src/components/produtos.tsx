"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { EVENTO_PRODUTO, PRODUTOS } from "@/content/site";

export function Produtos() {
  const [atual, setAtual] = useState(0);
  const abas = useRef<(HTMLButtonElement | null)[]>([]);
  const trilho = useRef<HTMLDivElement>(null);
  const p = PRODUTOS[atual];

  // menu do header e CTAs do hero escolhem a aba por evento
  useEffect(() => {
    const onEscolha = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (typeof i === "number" && PRODUTOS[i]) setAtual(i);
    };
    window.addEventListener(EVENTO_PRODUTO, onEscolha);
    return () => window.removeEventListener(EVENTO_PRODUTO, onEscolha);
  }, []);

  // aba ativa sempre visivel na rolagem horizontal do celular
  // (rolagem so horizontal: scrollIntoView puxaria a pagina junto)
  useEffect(() => {
    const t = trilho.current;
    const aba = abas.current[atual];
    if (!t || !aba || t.scrollWidth <= t.clientWidth) return;
    t.scrollTo({ left: aba.offsetLeft - (t.clientWidth - aba.offsetWidth) / 2, behavior: "smooth" });
  }, [atual]);

  const teclado = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const prox = (atual + (e.key === "ArrowRight" ? 1 : -1) + PRODUTOS.length) % PRODUTOS.length;
    setAtual(prox);
    abas.current[prox]?.focus();
  };

  return (
    <section id="produtos" className="mx-auto flex w-full max-w-[1320px] flex-col gap-8 px-4 py-16 sm:gap-10 sm:px-[clamp(16px,4vw,40px)] sm:py-[clamp(64px,8vw,112px)]">
      <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
        <div className="flex max-w-[640px] flex-col gap-3">
          <span className="font-mono text-[13px] text-navy">PLATAFORMA BEARA</span>
          <h2 className="m-0 font-display text-[clamp(32px,4.5vw,56px)] leading-none font-extrabold tracking-[-.03em]">
            Uma família de soluções para cada etapa do seu negócio.
          </h2>
        </div>
        <a href="#servicos" className="border-b-2 border-cyan pb-1 font-semibold hover:text-navy">
          Ver todas as soluções ›
        </a>
      </div>

      <div
        ref={trilho}
        role="tablist"
        aria-label="Produtos Beara"
        onKeyDown={teclado}
        className="no-scrollbar relative -mx-4 flex gap-2 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0"
        data-reveal
      >
        {PRODUTOS.map((item, i) => (
          <button
            key={item.slug}
            ref={(el) => { abas.current[i] = el; }}
            type="button"
            role="tab"
            id={`aba-${item.slug}`}
            aria-selected={i === atual}
            aria-controls="painel-produto"
            tabIndex={i === atual ? 0 : -1}
            onClick={() => setAtual(i)}
            className={`-mb-px shrink-0 border-b-[3px] px-4 py-3.5 text-base font-semibold whitespace-nowrap transition-colors sm:px-[18px] ${i === atual ? "border-cyan text-ink" : "border-transparent text-slate hover:text-ink"}`}
          >
            {item.nome}
          </button>
        ))}
      </div>

      <div
        id="painel-produto"
        role="tabpanel"
        aria-labelledby={`aba-${p.slug}`}
        className="grid items-stretch gap-8 lg:grid-cols-2"
        data-reveal
      >
        <div key={p.slug} className="flex flex-col justify-center gap-5">
          <span className="animate-rise font-mono text-[13px] text-muted">{p.tag}</span>
          {p.emBreve ? (
            <>
              <h3 className="animate-rise m-0 font-display text-[clamp(28px,3.5vw,44px)] leading-[1.02] font-extrabold tracking-[-.03em] [animation-delay:60ms]">
                {p.nome}
              </h3>
              <span className="animate-rise w-fit rounded-full bg-ink px-4 py-2 font-mono text-sm text-cyan [animation-delay:120ms]">● em breve</span>
            </>
          ) : (
            <>
              <h3 className="animate-rise m-0 font-display text-[clamp(28px,3.5vw,44px)] leading-[1.02] font-extrabold tracking-[-.03em] [animation-delay:60ms]">
                {p.titulo}
              </h3>
              <p className="animate-rise m-0 max-w-[52ch] text-[17px] leading-[1.55] text-slate sm:text-lg [animation-delay:120ms]">{p.texto}</p>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {(p.itens ?? []).map((item, i) => (
                  <li key={item} className="animate-rise flex items-baseline gap-3 text-base" style={{ animationDelay: `${180 + i * 70}ms` }}>
                    <span className="font-mono text-navy" aria-hidden>
                      &gt;_
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="animate-rise flex flex-wrap gap-3 pt-2 [animation-delay:400ms]">
                <a href="#contato" className="rounded-full bg-ink px-[22px] py-3.5 font-semibold text-paper transition-colors hover:bg-navy hover:text-white">
                  Solicitar demonstração
                </a>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="px-1 py-3.5 font-semibold">
                    Abrir {p.nome} ↗
                  </a>
                ) : (
                  <a href="#contato" className="px-1 py-3.5 font-semibold">
                    Saiba mais ›
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3.5 self-center rounded-[20px] bg-navy p-3 sm:p-[clamp(16px,2.5vw,28px)]">
          <div className="flex items-center gap-2.5 rounded-[10px] bg-ink px-3.5 py-2.5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-slate" />
              <span className="size-2.5 rounded-full bg-slate" />
              <span className="size-2.5 rounded-full bg-slate" />
            </div>
            <span className="truncate font-mono text-xs text-mist">{p.url}</span>
          </div>
          <div key={`v${p.slug}`} className="animate-pop relative aspect-[1200/630] w-full overflow-hidden rounded-xl bg-paper">
            {p.img ? (
              <Image src={p.img} alt={`Prévia do ${p.nome}`} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
            ) : (
              <EmBreve nome={p.nome} tag={p.tag} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// prévia para produto ainda sem imagem: grade ciano + nome, no lugar do aviso do design
function EmBreve({ nome, tag }: { nome: string; tag: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30,58,138,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <span className="font-mono text-xs text-navy">&gt;_ {tag}</span>
      <strong className="font-display text-[clamp(24px,3vw,36px)] font-extrabold tracking-[-.03em] text-ink">{nome}</strong>
      <span className="rounded-full bg-ink px-3 py-1 font-mono text-[11px] text-cyan">em breve</span>
    </div>
  );
}
