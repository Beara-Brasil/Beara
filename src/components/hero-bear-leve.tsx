"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ALTURA, FaceLogo, LARGURA, PARTES, S, raio } from "./hero-bear-partes";

// Versao leve do urso, para aparelho fraco: blocos planos com uma inclinacao
// fixa e animacoes so de CSS (translate/transform), que a placa de video faz
// sozinha. Sem requestAnimationFrame, sem camadas empilhadas.

export function HeroBearLeve() {
  const caixa = useRef<HTMLDivElement>(null);
  const escala = useRef<HTMLDivElement>(null);
  const [abrindo, setAbrindo] = useState(false);

  useEffect(() => {
    const box = caixa.current;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      const sc = Math.min(1, box.clientWidth / (LARGURA * 1.15));
      if (escala.current) escala.current.style.transform = `scale(${sc})`;
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const abrir = () => {
    setAbrindo(false);
    requestAnimationFrame(() => setAbrindo(true));
  };

  return (
    <div
      ref={caixa}
      className="relative flex aspect-square w-full max-w-[520px] cursor-pointer items-center justify-center select-none"
      onClick={abrir}
      role="img"
      aria-label="Símbolo da Beara"
    >
      <div ref={escala} className="relative shrink-0" style={{ width: LARGURA, height: ALTURA }}>
        {/* anel fixo e dois cubos flutuando */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 rounded-full border-[1.5px] border-cyan/45"
          style={{ width: 560, height: 560, marginLeft: -280, marginTop: -280, transform: "rotateX(72deg)" }}
        />
        <span aria-hidden className="urso-cubo absolute top-[18%] left-[-6%] size-4 rounded-[3px] bg-cyan" />
        <span aria-hidden className="urso-cubo absolute right-[-4%] bottom-[22%] size-2.5 rounded-[2px] bg-white [animation-delay:-2s]" />

        <div className="urso-flutuar absolute inset-0">
          {PARTES.map((p, k) => {
            const estilo = {
              left: (p.x - 4) * S,
              top: (p.y - 3) * S,
              width: p.w * S,
              height: p.h * S,
              "--dx": `${p.d[0] * 9}px`,
              "--dy": `${p.d[1] * 9}px`,
            } as CSSProperties;
            return (
              <div
                key={k}
                className={`absolute ${abrindo ? "urso-abrir" : "urso-respirar"}`}
                style={estilo}
                onAnimationEnd={(e) => e.animationName === "urso-abrir" && setAbrindo(false)}
              >
                {/* espessura falsa: uma placa escura deslocada, parada */}
                <div className="absolute inset-0" style={{ borderRadius: raio(p), background: "#081640", transform: "translate(7px, 9px)" }} />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ borderRadius: raio(p), background: p.orelha ? "#0F1420" : "#FFFFFF", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.25)" }}
                >
                  {p.orelha ? null : <FaceLogo p={p} olhoClassName="urso-piscar" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
