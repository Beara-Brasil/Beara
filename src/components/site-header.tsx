"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUTOS, SEGMENTOS, abrirProduto, contato, whatsappUrl } from "@/content/site";
import { BearaLogo } from "./logo";

type Menu = "sol" | "seg" | null;

export function SiteHeader() {
  const [menu, setMenu] = useState<Menu>(null);
  const [gaveta, setGaveta] = useState(false);
  const [aberto, setAberto] = useState<Menu>("sol");
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setRolou(window.scrollY > 8);
      setMenu(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // trava a rolagem do fundo e fecha com Esc
  useEffect(() => {
    if (!gaveta && !menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setGaveta(false);
        setMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    if (gaveta) document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [gaveta, menu]);

  // fecha a gaveta ao voltar para desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setGaveta(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const escolherProduto = (i: number) => {
    setMenu(null);
    setGaveta(false);
    abrirProduto(i);
  };
  const fechar = () => {
    setMenu(null);
    setGaveta(false);
  };

  const itemNav = "rounded-lg px-2.5 py-2.5 transition-colors hover:bg-paper";

  return (
    <header
      className={`sticky top-0 z-30 border-b border-line bg-white transition-shadow ${rolou ? "shadow-[0_8px_24px_-16px_rgba(15,20,32,.35)]" : ""}`}
      onMouseLeave={() => setMenu(null)}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-5 px-4 sm:px-[clamp(16px,4vw,40px)] lg:h-[72px]">
        <Link href="/#topo" onClick={fechar} className="shrink-0 text-ink hover:text-ink" aria-label="Beara — início">
          <BearaLogo />
        </Link>

        <nav aria-label="Principal" className="hidden min-w-0 flex-1 gap-1 text-[15px] font-medium whitespace-nowrap lg:flex">
          <button
            type="button"
            className={`${itemNav} ${menu === "sol" ? "bg-paper" : ""}`}
            aria-expanded={menu === "sol"}
            aria-controls="menu-solucoes"
            onMouseEnter={() => setMenu("sol")}
            onClick={() => setMenu(menu === "sol" ? null : "sol")}
          >
            Soluções <span aria-hidden className={`inline-block transition-transform ${menu === "sol" ? "rotate-180" : ""}`}>▾</span>
          </button>
          <button
            type="button"
            className={`${itemNav} ${menu === "seg" ? "bg-paper" : ""}`}
            aria-expanded={menu === "seg"}
            aria-controls="menu-segmentos"
            onMouseEnter={() => setMenu("seg")}
            onClick={() => setMenu(menu === "seg" ? null : "seg")}
          >
            Segmentos <span aria-hidden className={`inline-block transition-transform ${menu === "seg" ? "rotate-180" : ""}`}>▾</span>
          </button>
          <Link href="/#sobre" className={itemNav} onMouseEnter={() => setMenu(null)}>
            Sobre
          </Link>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          <Link
            href="/#contato"
            onClick={fechar}
            className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-paper transition-colors hover:bg-navy hover:text-white sm:px-5 sm:py-[11px] sm:text-[15px]"
          >
            Fale conosco
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            aria-label={gaveta ? "Fechar menu" : "Abrir menu"}
            aria-expanded={gaveta}
            aria-controls="menu-movel"
            onClick={() => setGaveta(!gaveta)}
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-ink transition-all ${gaveta ? "top-[5px] rotate-45" : "top-0"}`} />
              <span className={`absolute top-[5px] left-0 h-0.5 w-4 rounded bg-ink transition-opacity ${gaveta ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-ink transition-all ${gaveta ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
            </span>
          </button>
        </div>
      </div>

      {/* mega menus (desktop) */}
      {menu === "sol" && (
        <div id="menu-solucoes" className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_48px_-24px_rgba(15,20,32,.25)] lg:block">
          <div className="mx-auto grid max-w-[1320px] grid-cols-3 gap-8 px-[clamp(16px,4vw,40px)] py-8">
            {PRODUTOS.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => escolherProduto(i)}
                className="animate-rise flex flex-col gap-1.5 rounded-xl p-3 text-left transition-colors hover:bg-paper"
                style={{ animationDelay: `${i * 50}ms`, animationDuration: ".4s" }}
              >
                <span className="font-mono text-xs text-navy">{p.tag}</span>
                <strong className="font-display text-xl tracking-[-.02em]">{p.nome}</strong>
                <span className="text-sm leading-[1.45] text-slate">{p.resumo}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {menu === "seg" && (
        <div id="menu-segmentos" className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_48px_-24px_rgba(15,20,32,.25)] lg:block">
          <div className="mx-auto grid max-w-[1320px] grid-cols-6 gap-3 px-[clamp(16px,4vw,40px)] py-8">
            {SEGMENTOS.map((s, i) => (
              <Link
                key={s.nome}
                href="/#segmentos"
                onClick={fechar}
                className="animate-rise flex items-center justify-between rounded-xl border border-line p-4 font-semibold transition-colors hover:bg-paper"
                style={{ animationDelay: `${i * 40}ms`, animationDuration: ".4s" }}
              >
                {s.nome}
                <span className="text-navy">›</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* gaveta (celular e tablet) */}
      <div
        id="menu-movel"
        className={`fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col overflow-y-auto bg-white transition-[opacity,transform] duration-300 lg:hidden ${gaveta ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
        aria-hidden={!gaveta}
        inert={!gaveta}
      >
        <nav aria-label="Menu" className="flex flex-col px-4 py-2">
          <Acordeao titulo="Soluções" aberto={aberto === "sol"} onToggle={() => setAberto(aberto === "sol" ? null : "sol")}>
            {PRODUTOS.map((p, i) => (
              <button key={p.slug} type="button" onClick={() => escolherProduto(i)} className="flex flex-col gap-1 rounded-xl px-3 py-3 text-left active:bg-paper">
                <span className="font-mono text-[11px] text-navy">{p.tag}</span>
                <strong className="font-display text-lg tracking-[-.02em]">{p.nome}</strong>
                <span className="text-sm text-slate">{p.resumo}</span>
              </button>
            ))}
          </Acordeao>
          <Acordeao titulo="Segmentos" aberto={aberto === "seg"} onToggle={() => setAberto(aberto === "seg" ? null : "seg")}>
            <div className="grid grid-cols-2 gap-2 pb-2">
              {SEGMENTOS.map((s) => (
                <Link key={s.nome} href="/#segmentos" onClick={fechar} className="flex items-center justify-between rounded-xl border border-line px-3 py-3 text-[15px] font-semibold">
                  {s.nome}
                  <span className="text-navy">›</span>
                </Link>
              ))}
            </div>
          </Acordeao>
          <Link href="/#sobre" onClick={fechar} className="flex items-center justify-between border-b border-line py-5 font-display text-2xl font-extrabold tracking-[-.02em]">
            Sobre <span className="text-navy">›</span>
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-3 bg-paper px-4 pt-6 pb-[max(24px,env(safe-area-inset-bottom))]">
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-full bg-ink py-2 pr-2 pl-6 font-semibold text-white">
            Chamar no WhatsApp
            <span className="grid size-10 place-items-center rounded-full bg-cyan text-ink">↗</span>
          </a>
          <a href={contato.telefoneHref} className="text-center font-mono text-sm text-slate">
            {contato.telefone}
          </a>
        </div>
      </div>
    </header>
  );
}

function Acordeao({
  titulo,
  aberto,
  onToggle,
  children,
}: {
  titulo: string;
  aberto: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <button type="button" onClick={onToggle} aria-expanded={aberto} className="flex w-full items-center justify-between py-5 font-display text-2xl font-extrabold tracking-[-.02em]">
        {titulo}
        <span aria-hidden className={`text-base text-navy transition-transform ${aberto ? "rotate-180" : ""}`}>▾</span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ${aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden" inert={!aberto}>
          {children}
        </div>
      </div>
    </div>
  );
}
