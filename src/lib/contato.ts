// Formulario de contato: validacao e montagem da mensagem. Usado pela rota
// /api/contato (servidor) e pelo formulario (para o e-mail de reserva).

import { INTERESSES } from "@/content/site";

export type DadosContato = {
  nome: string;
  empresa?: string;
  email: string;
  whatsapp?: string;
  desafio?: string;
  interesses: string[];
};

export const LIMITES = { nome: 120, empresa: 120, email: 200, whatsapp: 40, desafio: 4000 } as const;

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

// tira espacos e caracteres de controle; vazio vira undefined
function limpar(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
  return s ? s.slice(0, max) : undefined;
}

export type Resultado = { ok: true; dados: DadosContato } | { ok: false; erro: string };

export function validarContato(entrada: unknown): Resultado {
  const e = (entrada ?? {}) as Record<string, unknown>;
  const nome = limpar(e.nome, LIMITES.nome);
  // cabecalho de e-mail nao pode ter quebra de linha
  const email = limpar(e.email, LIMITES.email)?.replace(/[\r\n]/g, "");
  if (!nome) return { ok: false, erro: "Informe seu nome." };
  if (!email || !EMAIL.test(email)) return { ok: false, erro: "Informe um e-mail válido." };
  const interesses = Array.isArray(e.interesses)
    ? e.interesses.filter((i): i is string => typeof i === "string" && INTERESSES.includes(i))
    : [];
  return {
    ok: true,
    dados: {
      nome,
      email,
      empresa: limpar(e.empresa, LIMITES.empresa),
      whatsapp: limpar(e.whatsapp, LIMITES.whatsapp),
      desafio: limpar(e.desafio, LIMITES.desafio),
      interesses: [...new Set(interesses)],
    },
  };
}

// texto da mensagem de reserva (mailto), quando o envio pelo site falha
export function mensagemTexto(d: DadosContato) {
  return [
    `Olá, Beara! Sou ${d.nome}${d.empresa ? `, da ${d.empresa}` : ""}.`,
    d.interesses.length ? `Interesse: ${d.interesses.join(", ")}.` : "",
    d.desafio ? `Desafio: ${d.desafio}` : "",
    `E-mail: ${d.email}`,
    d.whatsapp ? `WhatsApp: ${d.whatsapp}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// e-mail que chega para a Beara
export function montarEmail(d: DadosContato) {
  const assunto = `Novo contato pelo site: ${d.nome}${d.empresa ? ` (${d.empresa})` : ""}`.replace(/[\r\n]/g, " ");
  const linhas: [string, string | undefined][] = [
    ["Nome", d.nome],
    ["Empresa", d.empresa],
    ["E-mail", d.email],
    ["WhatsApp", d.whatsapp],
    ["Interesse", d.interesses.join(", ") || undefined],
  ];
  const texto = [
    ...linhas.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    "Desafio:",
    d.desafio ?? "(não informado)",
    "",
    "Responda este e-mail para falar direto com a pessoa.",
  ].join("\n");
  const tabela = linhas
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#475069;font-size:13px;vertical-align:top">${k}</td><td style="padding:6px 0;font-size:15px;color:#0F1420"><strong>${escapar(v!)}</strong></td></tr>`,
    )
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px">
<p style="font-family:monospace;color:#1E3A8A;font-size:12px;margin:0 0 8px">&gt;_ NOVO CONTATO PELO SITE</p>
<table style="border-collapse:collapse">${tabela}</table>
<p style="color:#475069;font-size:13px;margin:20px 0 6px">Desafio</p>
<div style="white-space:pre-wrap;font-size:15px;color:#0F1420;background:#F3F5F8;border-radius:12px;padding:14px 16px">${escapar(d.desafio ?? "(não informado)")}</div>
<p style="color:#5B6478;font-size:12px;margin-top:20px">Responda este e-mail para falar direto com a pessoa.</p>
</div>`;
  return { assunto, texto, html };
}
