"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { HeroBear3D, type Ponteiro } from "./hero-bear-3d";
import { HeroBearLeve } from "./hero-bear-leve";

// Escolhe entre o urso 3D e o leve. Comeca sempre no leve (e o que sai no HTML
// do servidor), e so sobe para o 3D em aparelho que aguenta. Se o 3D travar nos
// primeiros quadros, volta para o leve e lembra disso na sessao.
// Para testar: ?urso=3d ou ?urso=leve na URL.

const CHAVE = "beara:urso-leve";

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function aparelhoFraco() {
  const n = navigator as Nav;
  if (n.connection?.saveData) return true;
  if (typeof n.deviceMemory === "number" && n.deviceMemory <= 4) return true;
  if (typeof n.hardwareConcurrency === "number" && n.hardwareConcurrency <= 4) return true;
  return false;
}

function lerSessao() {
  try {
    return sessionStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

export function HeroBear({ ponteiro }: { ponteiro: RefObject<Ponteiro> }) {
  const [modo, setModo] = useState<"leve" | "3d">("leve");

  useEffect(() => {
    const forcado = new URLSearchParams(window.location.search).get("urso");
    if (forcado === "3d" || forcado === "leve") return setModo(forcado);
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduz && !lerSessao() && !aparelhoFraco()) setModo("3d");
  }, []);

  const pesado = useCallback(() => {
    if (new URLSearchParams(window.location.search).get("urso") === "3d") return;
    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch {
      // sem storage: so troca nesta visita
    }
    setModo("leve");
  }, []);

  return modo === "3d" ? (
    <div className="animate-pop w-full">
      <HeroBear3D ponteiro={ponteiro} onPesado={pesado} />
    </div>
  ) : (
    <HeroBearLeve />
  );
}
