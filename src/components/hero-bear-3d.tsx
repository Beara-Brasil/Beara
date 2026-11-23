"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

// Urso Beara em 3D feito so com CSS 3D transforms (porte do design original).
// Cada bloco do simbolo e uma pilha de camadas; o conjunto gira, "respira" e
// abre, com aneis e cubos orbitando. O ponteiro (mouse ou dedo) inclina a cena.

type Parte = {
  x: number; y: number; w: number; h: number;
  r: number | [number, number, number, number];
  d: [number, number];
  z: number;
  orelha?: boolean;
};

const PARTES: Parte[] = [
  { x: 6, y: 5, w: 25, h: 18, r: 3, d: [-1, -1.4], z: 1.3, orelha: true },
  { x: 64, y: 5, w: 25, h: 18, r: 3, d: [1, -1.4], z: 1.3, orelha: true },
  { x: 6, y: 26, w: 39, h: 29, r: [9, 1.5, 9, 1.5], d: [-1, -0.6], z: 0.6 },
  { x: 50, y: 26, w: 39, h: 29, r: [1.5, 9, 1.5, 9], d: [1, -0.6], z: 1 },
  { x: 6, y: 59, w: 39, h: 28, r: [1.5, 9, 1.5, 9], d: [-1, 0.8], z: 1 },
  { x: 50, y: 59, w: 39, h: 28, r: [9, 1.5, 9, 1.5], d: [1, 0.8], z: 0.6 },
];
const S = 4.4;
const CAMADAS = 9;
const LARGURA = 87 * S;
const ALTURA = 86 * S;

const raio = (p: Parte) => (Array.isArray(p.r) ? p.r.map((v) => `${v * S}px`).join(" ") : `${p.r * S}px`);

export type Ponteiro = { x: number; y: number; tx: number; ty: number };

function FaceLogo({ p, olhoRef }: { p: Parte; olhoRef: (el: SVGRectElement | null) => void }) {
  return (
    <svg
      viewBox="4 3 87 86"
      width={LARGURA}
      height={ALTURA}
      style={{ position: "absolute", left: -(p.x - 4) * S, top: -(p.y - 3) * S }}
      aria-hidden
    >
      <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
      <path d="M4,86 C22,79 38,64 48,54 S74,32 91,29 L91,95 L4,95 Z" fill="#22D3EE" />
      <path d="M4,86 C22,79 38,64 48,54 S74,32 91,29" fill="none" stroke="#1E3A8A" strokeWidth="2.6" />
      <rect x="22" y="38" width="8" height="8" fill="#1E3A8A" ref={olhoRef} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      <rect x="65" y="38" width="8" height="8" fill="#1E3A8A" ref={olhoRef} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
    </svg>
  );
}

export function HeroBear3D({ ponteiro, chao }: { ponteiro: RefObject<Ponteiro>; chao: RefObject<HTMLDivElement | null> }) {
  const caixa = useRef<HTMLDivElement>(null);
  const escala = useRef<HTMLDivElement>(null);
  const mundo = useRef<HTMLDivElement>(null);
  const partes = useRef<(HTMLDivElement | null)[]>([]);
  const olhos = useRef(new Set<SVGRectElement>());
  const aneis = useRef<(HTMLDivElement | null)[]>([]);
  const cubos = useRef<(HTMLDivElement | null)[]>([]);
  const explosao = useRef(0);

  useEffect(() => {
    const box = caixa.current;
    if (!box) return;

    // escala recalculada so quando o tamanho muda, nao a cada quadro
    const ro = new ResizeObserver(() => {
      const sc = Math.min(1, box.clientWidth / (LARGURA * 1.15));
      if (escala.current) escala.current.style.transform = `scale(${sc})`;
    });
    ro.observe(box);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visivel = true;
    let raf = 0;
    let t0: number | null = null;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (t0 === null) t0 = now;
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
      if (chao.current) chao.current.style.backgroundPosition = `${mx * -40}px ${(t * 24) % 64}px`;
    };

    const iniciar = () => {
      cancelAnimationFrame(raf);
      if (visivel && !document.hidden) raf = requestAnimationFrame(tick);
    };
    // pausa quando o hero sai da tela ou a aba fica em segundo plano
    const io = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      iniciar();
    });
    io.observe(box);
    document.addEventListener("visibilitychange", iniciar);
    iniciar();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", iniciar);
    };
  }, [ponteiro, chao]);

  const registrarOlho = (el: SVGRectElement | null) => {
    if (el) olhos.current.add(el);
  };

  const anel = (k: number, tamanho: number, tilt: string, tracejado: boolean): CSSProperties => ({
    position: "absolute",
    left: "50%",
    top: "50%",
    width: tamanho,
    height: tamanho,
    marginLeft: -tamanho / 2,
    marginTop: -tamanho / 2,
    borderRadius: "50%",
    border: `1.5px ${tracejado ? "dashed" : "solid"} rgba(34,211,238,.55)`,
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
          <div ref={(el) => { aneis.current[0] = el; }} style={anel(0, 560, "rotateX(72deg)", false)} />
          <div ref={(el) => { aneis.current[1] = el; }} style={anel(1, 470, "rotateX(72deg) rotateY(18deg)", true)} />
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
                boxShadow: "0 0 24px rgba(34,211,238,.6)",
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
                    background: l === CAMADAS ? "#081640" : l % 2 ? "#0E2466" : "#102870",
                    transform: `translateZ(${-l * 3}px)`,
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
