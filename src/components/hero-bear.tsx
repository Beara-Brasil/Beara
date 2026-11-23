"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { criarMonitor, NIVEL_MAX, type Leitura, type Nivel } from "@/lib/qualidade";
import { HeroBear3D, type Ponteiro } from "./hero-bear-3d";
import { HeroBearLeve } from "./hero-bear-leve";

// Escolhe a versao do urso pelo desempenho medido AGORA, o tempo todo:
// 3 = 3D completo | 2 = 3D simples (30 qps) | 1 = leve (so CSS) | 0 = parado.
// Comeca no leve (e o que vem no HTML do servidor), sobe enquanto os quadros
// estiverem lisos e desce sozinho se aparecer um pico de processamento.
// O ultimo nivel estavel fica guardado neste navegador para a proxima visita.
//
// Teste: ?urso=0..3 forca um nivel; ?debug=1 mostra o painel de medicao.

const CHAVE = "beara:urso-nivel";

function lerNivelSalvo(): Nivel | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto === null) return null; // Number(null) daria 0 = parado
    const v = Number(bruto);
    return Number.isInteger(v) && v >= 0 && v <= NIVEL_MAX ? (v as Nivel) : null;
  } catch {
    return null;
  }
}
function salvarNivel(n: Nivel) {
  try {
    localStorage.setItem(CHAVE, String(n));
  } catch {
    // sem storage: so vale nesta visita
  }
}

export function HeroBear({ ponteiro }: { ponteiro: RefObject<Ponteiro> }) {
  const caixa = useRef<HTMLDivElement>(null);
  const [nivel, setNivel] = useState<Nivel>(1);
  const [debug, setDebug] = useState<Leitura & { nivel: Nivel } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mostrarDebug = params.get("debug") === "1";
    const forcado = Number(params.get("urso") ?? "x");
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // movimento reduzido e escolha da pessoa, nao desempenho: fica parado
    if (reduz) return setNivel(0);
    if (params.has("urso") && Number.isInteger(forcado) && forcado >= 0 && forcado <= NIVEL_MAX) return setNivel(forcado as Nivel);

    const inicial = lerNivelSalvo() ?? 1;
    setNivel(inicial);
    const monitor = criarMonitor(inicial, performance.now());

    let raf = 0;
    let ultimo = 0;
    let visivel = true;
    let quadrosDebug = 0;

    const tick = (agora: number) => {
      raf = requestAnimationFrame(tick);
      if (ultimo) {
        const novo = monitor.registrar(agora - ultimo, agora);
        if (novo !== null) {
          setNivel(novo);
          salvarNivel(novo);
        }
      }
      ultimo = agora;
      if (mostrarDebug && ++quadrosDebug % 15 === 0) setDebug({ ...monitor.leitura, nivel: monitor.nivel });
    };
    // so mede com o hero na tela e a aba em primeiro plano
    const iniciar = () => {
      cancelAnimationFrame(raf);
      ultimo = 0;
      monitor.reiniciar(performance.now());
      if (visivel && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      iniciar();
    });
    if (caixa.current) io.observe(caixa.current);
    document.addEventListener("visibilitychange", iniciar);
    iniciar();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", iniciar);
    };
  }, []);

  // chao do hero para junto no nivel 0
  useEffect(() => {
    document.documentElement.dataset.urso = String(nivel);
  }, [nivel]);

  return (
    <div ref={caixa} className="relative w-full">
      {nivel >= 2 ? (
        <div className="animate-pop w-full">
          <HeroBear3D ponteiro={ponteiro} simples={nivel === 2} />
        </div>
      ) : (
        <HeroBearLeve parado={nivel === 0} />
      )}
      {debug && (
        <div data-debug-urso className="absolute top-0 left-0 z-10 rounded-lg bg-ink/90 px-3 py-2 font-mono text-[11px] leading-relaxed text-cyan">
          nível {debug.nivel} · {["parado", "leve", "3D simples", "3D completo"][debug.nivel]}
          <br />
          {debug.fps.toFixed(0)} qps · tela {(1000 / (debug.periodo || 16.7)).toFixed(0)} Hz · ruins {(debug.ruins * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}
