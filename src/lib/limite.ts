// Limite simples de envios por IP. Fica na memoria da instancia do servidor,
// entao zera quando ela reinicia: segura abuso basico, nao ataque dedicado.

export function criarLimite(max: number, janelaMs: number) {
  const tentativas = new Map<string, number[]>();
  return {
    excedeu(chave: string, agora = Date.now()) {
      const recentes = (tentativas.get(chave) ?? []).filter((t) => agora - t < janelaMs);
      recentes.push(agora);
      tentativas.set(chave, recentes);
      if (tentativas.size > 5000) tentativas.clear();
      return recentes.length > max;
    },
    limpar() {
      tentativas.clear();
    },
  };
}

// 5 mensagens a cada 10 minutos por IP
export const limiteContato = criarLimite(5, 10 * 60 * 1000);
