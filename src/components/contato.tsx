"use client";

import { useState, type FormEvent } from "react";
import { INTERESSES, contato, emailUrl } from "@/content/site";
import { mensagemTexto, validarContato } from "@/lib/contato";

// O envio vai para /api/contato, que manda um e-mail para a Beara. Se o envio
// falhar, o formulario oferece abrir o e-mail da pessoa com a mensagem pronta.
// Nada e gravado no navegador.

const campo =
  "w-full rounded-xl border border-line bg-paper px-4 py-3.5 text-base text-ink outline-none transition focus:border-navy focus:bg-white focus:ring-4 focus:ring-cyan/25";
const rotulo = "flex flex-col gap-1.5 text-[13px] font-semibold text-slate";

type Estado = { tipo: "editando" } | { tipo: "enviando" } | { tipo: "enviado" } | { tipo: "erro"; mensagem: string; reserva?: string };

export function Contato() {
  const [interesses, setInteresses] = useState<string[]>([]);
  const [estado, setEstado] = useState<Estado>({ tipo: "editando" });

  const alternar = (n: string) => setInteresses((atual) => (atual.includes(n) ? atual.filter((x) => x !== n) : [...atual, n]));

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado.tipo === "enviando") return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const corpo = { ...Object.fromEntries(["nome", "empresa", "email", "whatsapp", "desafio", "site"].map((k) => [k, String(f.get(k) ?? "")])), interesses };
    const v = validarContato(corpo);
    if (!v.ok) return setEstado({ tipo: "erro", mensagem: v.erro });
    const reserva = emailUrl(`Contato pelo site: ${v.dados.nome}`, mensagemTexto(v.dados));

    setEstado({ tipo: "enviando" });
    try {
      const r = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
      const resposta = (await r.json().catch(() => ({}))) as { ok?: boolean; erro?: string };
      if (r.ok && resposta.ok) {
        form.reset();
        setInteresses([]);
        return setEstado({ tipo: "enviado" });
      }
      // dado recusado: a pessoa corrige; falha do envio: oferece o e-mail
      if (r.status === 422) return setEstado({ tipo: "erro", mensagem: resposta.erro ?? "Confira os campos." });
      setEstado({ tipo: "erro", mensagem: resposta.erro ?? "Não conseguimos enviar agora.", reserva });
    } catch {
      setEstado({ tipo: "erro", mensagem: "Sem conexão no momento. Tente de novo ou mande direto pelo seu e-mail:", reserva });
    }
  };

  return (
    <section id="contato" className="mx-auto w-full max-w-[1320px] px-4 py-16 sm:px-[clamp(16px,4vw,40px)] sm:py-[clamp(64px,8vw,112px)]">
      <div
        className="relative grid items-start gap-8 overflow-hidden rounded-[28px] bg-navy p-5 text-white sm:gap-[clamp(32px,4vw,56px)] sm:p-[clamp(24px,4vw,56px)] lg:grid-cols-2"
        data-reveal
      >
        <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[520px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(34,211,238,.22), transparent)" }} />
        <div className="relative flex flex-col gap-8 pt-2">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[13px] text-cyan">&gt;_ CONTATO</span>
            <h2 className="m-0 font-display text-[clamp(36px,5vw,60px)] leading-[.95] font-extrabold tracking-[-.035em] [text-wrap:balance]">
              Vamos falar com um especialista?
            </h2>
            <p className="m-0 max-w-[42ch] text-lg leading-normal text-mist [text-wrap:pretty]">
              Conte o desafio. Um especialista responde em até 1 dia útil com os próximos passos — sem compromisso.
            </p>
          </div>
          <div className="flex flex-col border-t border-navy-line">
            <CanalLink href={`mailto:${contato.email}`} rotulo="E-mail" valor={contato.email} />
          </div>
        </div>

        <div className="relative rounded-[20px] bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgba(8,22,64,.6)] sm:p-[clamp(20px,3vw,32px)]">
          {estado.tipo === "enviado" ? (
            <div className="flex min-h-[360px] flex-col items-start justify-center gap-3" role="status">
              <span className="animate-pop grid size-14 place-items-center rounded-full bg-cyan text-[26px]">✓</span>
              <strong className="font-display text-[32px] tracking-[-.02em]">Mensagem enviada.</strong>
              <span className="text-[17px] leading-normal text-slate">Um especialista retorna em até 1 dia útil.</span>
              <button type="button" onClick={() => setEstado({ tipo: "editando" })} className="px-0 pt-3 font-semibold text-slate hover:text-ink">
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} className="flex flex-col gap-5" noValidate>
              {/* campo isca para robos: escondido de pessoas e leitores de tela */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Site
                  <input name="site" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
                <legend className="mb-2.5 p-0 text-[13px] font-semibold text-slate">Interesse</legend>
                <div className="flex flex-wrap gap-2">
                  {INTERESSES.map((n) => {
                    const on = interesses.includes(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={on}
                        onClick={() => alternar(n)}
                        className={`rounded-full border-[1.5px] px-4 py-2.5 text-sm font-semibold transition ${on ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-navy"}`}
                      >
                        {on ? "✓ " : ""}
                        {n}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className={rotulo}>
                  Nome
                  <input name="nome" required autoComplete="name" placeholder="Seu nome" className={campo} />
                </label>
                <label className={rotulo}>
                  Empresa
                  <input name="empresa" autoComplete="organization" placeholder="Nome da empresa" className={campo} />
                </label>
                <label className={rotulo}>
                  E-mail
                  <input name="email" required type="email" autoComplete="email" inputMode="email" placeholder="voce@empresa.com" className={campo} />
                </label>
                <label className={rotulo}>
                  WhatsApp (opcional)
                  <input name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="(00) 00000-0000" className={campo} />
                </label>
              </div>
              <label className={rotulo}>
                Qual é o desafio?
                <textarea name="desafio" rows={4} placeholder="Ex.: quero um app de delivery para as lojas da minha cidade" className={`${campo} resize-y`} />
              </label>
              {estado.tipo === "erro" && (
                <div role="alert" className="flex flex-col gap-3 rounded-xl border border-[#F5C2C7] bg-[#FDF2F3] px-4 py-3 text-sm text-[#8A1C2B]">
                  <span>{estado.mensagem}</span>
                  {estado.reserva && (
                    <a href={estado.reserva} className="w-fit rounded-full bg-ink px-4 py-2 font-semibold text-white hover:bg-navy hover:text-white">
                      Enviar pelo meu e-mail ↗
                    </a>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={estado.tipo === "enviando"}
                className="group flex items-center justify-between rounded-full bg-ink py-2 pr-2 pl-6 text-base font-semibold text-white transition-colors hover:bg-navy disabled:cursor-wait disabled:opacity-70"
              >
                {estado.tipo === "enviando" ? "Enviando…" : "Enviar mensagem"}
                <span className="grid size-10 place-items-center rounded-full bg-cyan text-lg text-ink transition-transform group-hover:translate-x-0.5">→</span>
              </button>
              <span className="text-center text-xs text-muted">
                Seus dados são usados apenas para retornar o contato —{" "}
                <a href="/privacidade" className="underline underline-offset-2 hover:text-navy">
                  política de privacidade
                </a>
                .
              </span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function CanalLink({ href, rotulo, valor, externo }: { href: string; rotulo: string; valor: string; externo?: boolean }) {
  return (
    <a
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center justify-between gap-4 border-b border-navy-line py-[18px] text-white hover:text-cyan"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] text-mist">{rotulo}</span>
        <strong className="truncate text-lg">{valor}</strong>
      </span>
      <span className="text-xl transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
        ↗
      </span>
    </a>
  );
}
