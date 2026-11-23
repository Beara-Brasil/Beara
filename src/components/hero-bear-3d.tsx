"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { ALTURA, FaceLogo, LARGURA, PARTES, S, raio } from "./hero-bear-partes";

// Urso Beara em 3D so com CSS 3D transforms (porte do design original), em
// versao enxuta: medido com CPU 6x mais lenta, as 10 camadas por bloco, os
// aneis tracejados e o brilho dos cubos eram a maior parte do custo de desenho.
// Agora: 3 camadas por bloco, aneis lisos e cubos sem sombra.

export type Ponteiro = { x: number; y: number; tx: number; ty: number };

const CAMADAS = 3;
const PASSO = 5; // px entre camadas (espessura total 15px)

export function HeroBear3D({ ponteiro, onPesado }: { ponteiro: RefObject<Ponteiro>; onPesado?: () => void }) {
  const caixa = useRef<HTMLDivElement>(null);
  const escala = useRef<HTMLDivElement>(null);
  const mundo = useRef<HTMLDivElement>(null);
  const partes = useRef<(HTMLDivElement | null)[]>([]);
  const olhos = useRef(new Set<SVGRectElement>());
  const aneis = useRef<(HTMLDivElement | null)[]>([]);
  const cubos = useRef<(HTMLDivElement | null)[]>([]);
  const explosao = useRef(0);
  const pesado = useRef(onPesado);
  pesado.current = onPesado;

  useEffect(() => {
    const box = caixa.current;
    if (!box) return;

    const ro = new ResizeObserver(() => {
      const sc = Math.min(1, box.clientWidth / (LARGURA * 1.15));
      if (escala.current) escala.current.style.transform = `scale(${sc})`;
    });
    ro.observe(box);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visivel = true;
    let raf = 0;
    let t0: number | null = null;
    let ultimo = 0;
    // Detecta aparelho que nao aguenta, por dois sinais nos primeiros segundos:
    // 1) quadros lentos (mediana > 24ms); 2) tarefas longas na thread principal
    // somando mais de 20% do tempo (Long Tasks API, Chrome/Android).
    const quadros: number[] = [];
    let quadrosAvaliados = false;
    let decidido = false;
    const declararPesado = () => {
      if (decidido) return;
      decidido = true;
      pesado.current?.();
    };
    let longas = 0;
    let obs: PerformanceObserver | undefined;
    const inicioObs = performance.now();
    try {
      obs = new PerformanceObserver((lista) => {
        for (const e of lista.getEntries()) longas += e.duration;
        const decorrido = performance.now() - inicioObs;
        if (decorrido > 1500 && longas / decorrido > 0.2) {
          obs?.disconnect();
          declararPesado();
        }
        if (decorrido > 6000) obs?.disconnect();
      });
      obs.observe({ type: "longtask", buffered: false });
    } catch {
      // navegador sem Long Tasks API (ex.: Safari): fica so o sinal dos quadros
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (t0 === null) t0 = now;
      if (!quadrosAvaliados && ultimo) {
        quadros.push(now - ultimo);
        // ignora os primeiros quadros (hidratacao) e avalia ~90 quadros
        if (quadros.length >= 100) {
          const amostra = quadros.slice(10).sort((a, b) => a - b);
          const mediana = amostra[Math.floor(amostra.length / 2)];
          quadrosAvaliados = true;
          if (mediana > 24) declararPesado();
        }
      }
      ultimo = now;

      const reduz = mq.matches;
      const t = reduz ? 0 : (now - t0) / 1000;
      const m = ponteiro.current;
      if (m) {
        m.x += (m.tx - m.x) * 0.06;
        m.y += (m.ty - m.y) * 0.06;
      }
      const mx = m?.x ?? 0;
      const my = m?.y ?? 0;
      explosao.current *= 0.94;

      if (mundo.current) {
        mundo.current.style.transform =
          `rotateX(${14 + Math.cos(t * 0.5) * 6 - my * 18}deg) rotateY(${-22 + Math.sin(t * 0.4) * 16 + mx * 28}deg) translateY(${Math.sin(t * 0.9) * 8}px)`;
      }
      const ex = Math.min(1.6, (reduz ? 0.5 : Math.pow((Math.sin(t * 0.7) + 1) / 2, 2)) + explosao.current);
      PARTES.forEach((p, k) => {
        const el = partes.current[k];
        if (el) el.style.transform = `translate3d(${p.d[0] * ex * 16}px,${p.d[1] * ex * 16}px,${ex * 70 * p.z + 10}px) rotateZ(${p.d[0] * ex * 3}deg)`;
      });
      const c = reduz ? 1 : (now % 3800) / 3800;
      const piscada = c > 0.94 ? Math.abs(Math.sin(((c - 0.94) / 0.06) * Math.PI)) : 0;
      olhos.current.forEach((el) => (el.style.transform = `scaleY(${1 - piscada * 0.9})`));
      if (aneis.current[0]) aneis.current[0].style.transform = `rotateX(72deg) rotateZ(${t * 20}deg)`;
      if (aneis.current[1]) aneis.current[1].style.transform = `rotateX(66deg) rotateY(18deg) rotateZ(${-t * 30}deg)`;
      for (let k = 0; k < 4; k++) {
        const cubo = cubos.current[k];
        if (!cubo) continue;
        const a = t * (0.5 + k * 0.12) + k * 1.6;
        const R = 230 + k * 18;
        cubo.style.transform = `translate3d(${Math.cos(a) * R}px,${Math.sin(a * 1.3) * 60 - 20}px,${Math.sin(a) * R * 0.6}px) rotateX(${t * 90}deg) rotateY(${t * 120}deg)`;
      }
    };

    const iniciar = () => {
      cancelAnimationFrame(raf);
      ultimo = 0;
      if (visivel && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      iniciar();
    });
    io.observe(box);
    document.addEventListener("visibilitychange", iniciar);
    iniciar();

    return () => {
      cancelAnimationFrame(raf);
      obs?.disconnect();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", iniciar);
    };
  }, [ponteiro]);

  const registrarOlho = (el: SVGRectElement | null) => {
    if (el) olhos.current.add(el);
  };

  const anel = (tamanho: number, tilt: string, opacidade: number): CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: tamanho,
    height: tamanho,
    marginLeft: -tamanho / 2,
    marginTop: -tamanho / 2,
    borderRadius: "50%",
    border: `1.5px solid rgba(34,211,238,${opacidade})`,
    transform: tilt,
  });

  return (
    <div
      ref={caixa}
      className="relative flex aspect-square w-full max-w-[520px] cursor-pointer items-center justify-center select-none [perspective:1400px]"
      onClick={() => (explosao.current = 1)}
      role="img"
      aria-label="Símbolo da Beara em 3D"
    >
      <div ref={escala} className="relative shrink-0" style={{ width: LARGURA, height: ALTURA }}>
        <div ref={mundo} className="absolute inset-0 [transform-style:preserve-3d]">
          <div ref={(el) => { aneis.current[0] = el; }} style={anel(560, "rotateX(72deg)", 0.55)} />
          <div ref={(el) => { aneis.current[1] = el; }} style={anel(470, "rotateX(72deg) rotateY(18deg)", 0.35)} />
          {[0, 1, 2, 3].map((k) => (
            <div
              key={`c${k}`}
              ref={(el) => { cubos.current[k] = el; }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 18 - k * 3,
                height: 18 - k * 3,
                borderRadius: 3,
                background: k % 2 ? "#FFFFFF" : "#22D3EE",
              }}
            />
          ))}
          {PARTES.map((p, k) => (
            <div
              key={k}
              ref={(el) => { partes.current[k] = el; }}
              className="[transform-style:preserve-3d]"
              style={{ position: "absolute", left: (p.x - 4) * S, top: (p.y - 3) * S, width: p.w * S, height: p.h * S }}
            >
              {Array.from({ length: CAMADAS }, (_, i) => CAMADAS - i).map((l) => (
                <div
                  key={l}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: raio(p),
                    background: l === CAMADAS ? "#081640" : "#0E2466",
                    transform: `translateZ(${-l * PASSO}px)`,
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: raio(p),
                  overflow: "hidden",
                  background: p.orelha ? "#0F1420" : "#FFFFFF",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,.25)",
                }}
              >
                {p.orelha ? null : <FaceLogo p={p} olhoRef={registrarOlho} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
