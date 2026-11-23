// Ajuste automatico de qualidade do urso do hero, baseado so no desempenho
// medido agora no aparelho (nada de ficha tecnica).
//
// O monitor recebe o intervalo entre quadros (requestAnimationFrame) e:
// - estima a taxa da tela do proprio aparelho (60 Hz, 90 Hz, 120 Hz...) pelos
//   quadros mais rapidos ja vistos, e guarda o melhor valor: se tudo ficar
//   lento por igual, ele nao confunde 30 qps com "tela de 30 Hz";
// - nao avalia nada nos primeiros instantes (carregamento da pagina);
// - conta como "quadro ruim" o que demorou mais de 1,6x esse periodo;
// - DESCE um nivel quando mais de 25% dos quadros da ultima ~1 s sao ruins;
// - SOBE um nivel quando fica estavel (menos de 5% ruins) por um tempo;
// - se um nivel ja falhou, so tenta subir para ele de novo depois de uma espera
//   que dobra a cada falha (8 s, 16 s...) e desiste dele depois de 3 falhas.

export type Nivel = 0 | 1 | 2 | 3;
// 0 = parado | 1 = leve (so CSS) | 2 = 3D simples a 30 qps | 3 = 3D completo
export const NIVEL_MAX: Nivel = 3;

export const AJUSTE = {
  janela: 60, // quadros considerados (~1 s a 60 Hz)
  minimoAmostras: 40,
  assentar: 800, // ms ignorados logo depois de trocar de nivel
  fatorRuim: 1.6,
  limiteDescer: 0.25,
  limiteSubir: 0.05,
  esperaSubir: 1200, // ms estavel antes de subir
  esperaFalha: 8000, // ms de bloqueio apos a 1a falha de um nivel (dobra a cada falha)
  maxFalhas: 3,
  pausa: 500, // intervalo maior que isso = aba/tela pausada, nao conta
  carencia: 2000, // ms ignorados no inicio (carregamento da pagina)
} as const;

export type Leitura = { fps: number; ruins: number; periodo: number };

export function criarMonitor(nivelInicial: Nivel, agora: number) {
  let nivel = nivelInicial;
  let quadros: number[] = [];
  // a carencia do inicio entra como se o nivel tivesse acabado de mudar
  let desde = agora + AJUSTE.carencia - AJUSTE.assentar;
  let periodoTela = Infinity;
  const falhas: Record<number, number> = {};
  const bloqueadoAte: Record<number, number> = {};
  let leitura: Leitura = { fps: 0, ruins: 0, periodo: 0 };

  const trocar = (novo: Nivel, t: number) => {
    nivel = novo;
    quadros = [];
    desde = t;
    return nivel;
  };

  return {
    get nivel() {
      return nivel;
    },
    get leitura() {
      return leitura;
    },
    // recomeca a contagem (ex.: o hero voltou a aparecer na tela)
    reiniciar(t: number) {
      quadros = [];
      desde = Math.max(desde, t);
    },
    // registra um intervalo; devolve o novo nivel quando ele muda
    registrar(intervalo: number, t: number): Nivel | null {
      if (intervalo <= 0 || intervalo > AJUSTE.pausa) return null;
      // quadros do carregamento ou logo apos uma troca nem entram na janela
      if (t - desde < AJUSTE.assentar) return null;
      quadros.push(intervalo);
      if (quadros.length > AJUSTE.janela) quadros.shift();
      if (quadros.length < AJUSTE.minimoAmostras) return null;

      const ordenados = [...quadros].sort((a, b) => a - b);
      // periodo da tela: os 10% mais rapidos, o melhor ja visto (entre 144 Hz e 60 Hz)
      periodoTela = Math.min(periodoTela, ordenados[Math.floor(ordenados.length * 0.1)]);
      const periodo = Math.min(16.7, Math.max(6.9, periodoTela));
      const ruins = quadros.filter((q) => q > periodo * AJUSTE.fatorRuim).length / quadros.length;
      const mediana = ordenados[Math.floor(ordenados.length / 2)];
      leitura = { fps: 1000 / mediana, ruins, periodo };

      if (ruins > AJUSTE.limiteDescer && nivel > 0) {
        const n = (falhas[nivel] = (falhas[nivel] ?? 0) + 1);
        bloqueadoAte[nivel] = n >= AJUSTE.maxFalhas ? Infinity : t + AJUSTE.esperaFalha * 2 ** (n - 1);
        return trocar((nivel - 1) as Nivel, t);
      }
      const acima = (nivel + 1) as Nivel;
      if (ruins < AJUSTE.limiteSubir && nivel < NIVEL_MAX && t - desde >= AJUSTE.esperaSubir && t >= (bloqueadoAte[acima] ?? 0)) {
        return trocar(acima, t);
      }
      return null;
    },
  };
}
