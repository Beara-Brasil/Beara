import { describe, expect, it } from "vitest";
import { criarMonitor, type Nivel } from "./qualidade";

// simula a tela: alimenta o monitor com quadros de duracao fixa
function rodar(m: ReturnType<typeof criarMonitor>, t: number, ms: number, intervalo: (i: number) => number, pararNaTroca = false) {
  const fim = t + ms;
  const trocas: Nivel[] = [];
  let i = 0;
  while (t < fim) {
    const d = intervalo(i++);
    t += d;
    const novo = m.registrar(d, t);
    if (novo !== null) {
      trocas.push(novo);
      if (pararNaTroca) break;
    }
  }
  return { t, trocas };
}

const liso60 = () => 16.7;
const liso120 = () => 8.3;
// metade dos quadros perdidos (30 qps numa tela de 60 Hz)
const travando = (i: number) => (i % 2 ? 16.7 : 33.4);

describe("monitor de qualidade", () => {
  it("sobe ate o 3D completo quando o aparelho aguenta", () => {
    const m = criarMonitor(1, 0);
    const r = rodar(m, 0, 8000, liso60);
    expect(r.trocas).toEqual([2, 3]);
    expect(m.nivel).toBe(3);
  });

  it("entende tela de 120 Hz como periodo proprio, sem achar que trava", () => {
    const m = criarMonitor(1, 0);
    rodar(m, 0, 8000, liso120);
    expect(m.nivel).toBe(3);
  });

  it("desce quando o desempenho piora do nada e para no nivel que aguenta", () => {
    const m = criarMonitor(3, 0);
    // fica liso, depois comeca a travar (pico de processamento)
    let r = rodar(m, 0, 3000, liso60);
    expect(m.nivel).toBe(3);
    r = rodar(m, r.t, 4000, travando);
    expect(r.trocas[0]).toBe(2);
    expect(m.nivel).toBeLessThan(3);
  });

  it("volta a subir quando o pico passa, mas so depois da espera", () => {
    const m = criarMonitor(3, 0);
    let r = rodar(m, 0, 3000, liso60); // passa o carregamento liso
    r = rodar(m, r.t, 5000, travando, true); // pico: cai de 3 para 2
    const caiu = m.nivel;
    expect(caiu).toBeLessThan(3);
    r = rodar(m, r.t, 4000, liso60); // estavel de novo, mas 3 bloqueado por 8 s
    expect(m.nivel).toBeLessThan(3);
    rodar(m, r.t, 12000, liso60);
    expect(m.nivel).toBe(3);
  });

  it("desiste de um nivel depois de 3 falhas", () => {
    const m = criarMonitor(3, 0);
    let t = 0;
    for (let k = 0; k < 3; k++) {
      // espera liberar e subir ate o 3, depois trava
      t = rodar(m, t, 70000, liso60).t;
      expect(m.nivel).toBe(3);
      t = rodar(m, t, 5000, travando, true).t;
      expect(m.nivel).toBe(2);
    }
    rodar(m, t, 200000, liso60);
    expect(m.nivel).toBe(2);
  });

  it("nao desce por causa do carregamento da pagina", () => {
    const m = criarMonitor(1, 0);
    // primeiros 1,5 s travados (hidratacao), depois liso
    const r = rodar(m, 0, 6000, (i) => (i < 30 ? 50 : 16.7));
    expect(r.trocas).not.toContain(0);
    expect(m.nivel).toBe(3);
  });

  it("percebe 30 qps constantes numa tela de 60 Hz como travamento", () => {
    const m = criarMonitor(3, 0);
    let r = rodar(m, 0, 3000, liso60);
    r = rodar(m, r.t, 6000, () => 33.4);
    expect(r.trocas[0]).toBe(2);
    expect(m.nivel).toBe(0);
  });

  it("ignora pausas longas (aba em segundo plano)", () => {
    const m = criarMonitor(3, 0);
    const r = rodar(m, 0, 3000, (i) => (i === 50 ? 5000 : 16.7));
    expect(r.trocas).toEqual([]);
    expect(m.nivel).toBe(3);
  });
});
