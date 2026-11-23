"use client";

import { useEffect, useRef, useState, type PointerEvent, type TouchEvent } from "react";
import { SLIDES, abrirProduto } from "@/content/site";
import { HeroBear } from "./hero-bear";
import type { Ponteiro } from "./hero-bear-3d";

function useReducedMotion() {
  const [reduz, setReduz] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduz(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduz;
}

export function Hero() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const reduz = useReducedMotion();
  const ponteiro = useRef<Ponteiro>({ x: 0, y: 0, tx: 0, ty: 0 });
  const toque = useRef<{ x: number; y: number } | null>(null);
  const slide = SLIDES[atual];
  const autoplay = !reduz;

  const ir = (i: number) => setAtual((i + SLIDES.length) % SLIDES.length);

  const mover = (ev: PointerEvent<HTMLElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    ponteiro.current.tx = (ev.clientX - r.left) / r.width - 0.5;
    ponteiro.current.ty = (ev.clientY - r.top) / r.height - 0.5;
  };
  const soltar = () => {
    ponteiro.current.tx = 0;
    ponteiro.current.ty = 0;
  };

  // swipe horizontal no celular troca o slide
  const inicioToque = (e: TouchEvent) => {
    const t = e.touches[0];
    toque.current = { x: t.clientX, y: t.clientY };
  };
  const fimToque = (e: TouchEvent) => {
    const ini = toque.current;
    toque.current = null;
    soltar();
    if (!ini) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - ini.x;
    const dy = t.clientY - ini.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) ir(atual + (dx < 0 ? 1 : -1));
  };

  const cta = () => {
    if (slide.produto === undefined) document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
    else abrirProduto(slide.produto);
  };

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Destaques da Beara"
      className="relative overflow-hidden bg-navy text-white"
      onPointerMove={mover}
      onPointerLeave={soltar}
      onTouchStart={inicioToque}
      onTouchEnd={fimToque}
      // pausa so com foco de teclado; toque no celular nao trava o autoplay
      onFocus={(e) => e.target.matches(":focus-visible") && setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      {/* chao em grade com perspectiva */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%] [perspective:600px]" aria-hidden>
        <div className="absolute -inset-x-1/2 -bottom-[10%] h-[140%] origin-bottom overflow-hidden [transform:rotateX(68deg)]"
          style={{
            WebkitMaskImage: "linear-gradient(to top, #000 10%, transparent 85%)",
            maskImage: "linear-gradient(to top, #000 10%, transparent 85%)",
          }}
        >
          {/* a grade anda por transform: a placa de video move, nada e repintado */}
          <div
            className="urso-chao absolute inset-x-0 -top-16 bottom-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.22) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>
      </div>
      {/* brilho radial atras do urso */}
      <div
        className="pointer-events-none absolute -right-40 top-1/2 z-0 hidden h-[900px] w-[900px] -translate-y-1/2 rounded-full lg:block"
        style={{ background: "radial-gradient(closest-side, rgba(34,211,238,.18), transparent)" }}
        aria-hidden
      />

      <div className="relative z-[1] mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1fr)] items-center gap-6 px-4 pt-10 pb-6 sm:px-[clamp(16px,4vw,40px)] sm:pt-[clamp(48px,7vw,96px)] lg:grid-cols-2 lg:gap-12 lg:pb-10">
        <div className="flex max-w-[640px] flex-col gap-5 sm:gap-6" aria-live="polite">
          <div key={atual} className="flex flex-col gap-5 sm:gap-6">
            <span className="animate-rise font-mono text-[13px] text-cyan">{slide.tag}</span>
            <h1
              className="animate-rise m-0 font-display text-[clamp(38px,6vw,80px)] leading-[.95] font-extrabold tracking-[-.035em] [text-wrap:balance] [animation-delay:60ms]"
            >
              {slide.titulo}
            </h1>
            <p className="animate-rise m-0 max-w-[50ch] text-[clamp(17px,1.5vw,20px)] leading-normal text-mist [animation-delay:120ms]">
              {slide.texto}
            </p>
            <div className="animate-rise flex flex-wrap gap-3 [animation-delay:180ms]">
              <button
                type="button"
                onClick={cta}
                className="group flex items-center gap-3 rounded-full bg-cyan py-4 pr-4 pl-6 text-base font-semibold text-ink transition hover:bg-white"
              >
                {slide.cta}
                <span className="grid size-7 place-items-center rounded-full bg-ink text-cyan transition group-hover:translate-x-0.5">→</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[360px]">
          <div className="w-[min(100%,340px)] sm:w-full sm:max-w-[520px]">
            <HeroBear ponteiro={ponteiro} />
          </div>
          {/* painel de status do slide */}
          <div
            key={`t${atual}`}
            className="absolute bottom-0 left-0 hidden w-[260px] rounded-2xl border border-white/10 bg-ink/90 p-4 font-mono text-[12px] shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)] sm:block lg:-left-4"
            aria-hidden
          >
            <div className="mb-3 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate" />
              <span className="size-2 rounded-full bg-slate" />
              <span className="size-2 rounded-full bg-slate" />
              <span className="ml-2 text-mist">beara ~ status</span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {slide.linhas.map((l, i) => (
                <li
                  key={l.k}
                  className="animate-rise flex justify-between gap-3"
                  style={{ animationDelay: `${250 + i * 160}ms` }}
                >
                  <span className="text-mist">{l.k}</span>
                  <span className="text-cyan">● {l.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* abas do carrossel com barra de progresso */}
      <div className="relative z-[1] mx-auto max-w-[1320px] px-4 pb-8 sm:px-[clamp(16px,4vw,40px)] sm:pb-10" role="tablist" aria-label="Escolher destaque"
        onPointerEnter={(e) => e.pointerType === "mouse" && setPausado(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPausado(false)}
      >
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${SLIDES.length}, minmax(0, 1fr))` }}>
          {SLIDES.map((s, i) => {
            const ativo = i === atual;
            return (
              <button
                key={s.label}
                type="button"
                role="tab"
                aria-selected={ativo}
                aria-label={s.label}
                onClick={() => ir(i)}
                className={`relative pt-3.5 text-left text-sm font-medium transition-colors ${ativo ? "text-white" : "text-mist hover:text-white"}`}
              >
                <span className="absolute inset-x-0 top-0 h-[3px] overflow-hidden rounded-full bg-ink-line">
                  {ativo && (
                    <span
                      key={`${atual}-${autoplay}`}
                      className={`absolute inset-0 origin-left bg-cyan ${autoplay ? "animate-fill" : ""}`}
                      style={{ animationPlayState: pausado ? "paused" : "running" }}
                      onAnimationEnd={() => autoplay && ir(atual + 1)}
                    />
                  )}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 font-mono text-xs text-mist sm:hidden">
          {String(atual + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")} · {slide.label}
          <span className="ml-2 opacity-60">deslize ↔</span>
        </p>
      </div>
    </section>
  );
}
