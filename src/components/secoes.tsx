import { ETAPAS, SEGMENTOS, SERVICOS, STACK } from "@/content/site";

export function Segmentos() {
  return (
    <section id="segmentos" className="bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-10 px-4 py-16 sm:px-[clamp(16px,4vw,40px)] sm:py-[clamp(64px,8vw,112px)]">
        <div className="flex max-w-[720px] flex-col gap-3" data-reveal>
          <span className="font-mono text-[13px] text-navy">&gt;_ SEGMENTOS</span>
          <h2 className="m-0 font-display text-[clamp(32px,4.5vw,56px)] leading-none font-extrabold tracking-[-.03em]">
            Software para a operação que você já tem.
          </h2>
        </div>
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[20px] border border-line bg-line p-0 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTOS.map((s, i) => (
            <li
              key={s.nome}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}
              className="group relative flex min-h-[150px] flex-col justify-between gap-6 bg-white p-6 transition-colors hover:bg-navy sm:min-h-[220px] sm:p-8"
            >
              <span className="font-mono text-[13px] text-muted transition-colors group-hover:text-cyan">{s.num}</span>
              <div className="flex flex-col gap-2">
                <strong className="font-display text-[26px] font-extrabold tracking-[-.02em] transition-colors group-hover:text-white">{s.nome}</strong>
                <span className="text-[15px] leading-normal text-slate transition-colors group-hover:text-mist">{s.texto}</span>
              </div>
              <span
                aria-hidden
                className="absolute top-6 right-6 grid size-9 place-items-center rounded-full border border-line text-navy transition-all group-hover:rotate-[-45deg] group-hover:border-cyan group-hover:bg-cyan group-hover:text-ink sm:top-8 sm:right-8"
              >
                →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Sobre() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.07) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage: "radial-gradient(ellipse at 20% 0%, #000 20%, transparent 70%)",
          maskImage: "radial-gradient(ellipse at 20% 0%, #000 20%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1320px] flex-col gap-14 px-4 py-16 sm:px-[clamp(16px,4vw,40px)] sm:py-[clamp(64px,8vw,112px)]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12" data-reveal>
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[13px] text-cyan">&gt;_ SOBRE A BEARA</span>
            <h2 className="m-0 font-display text-[clamp(34px,5vw,64px)] leading-[.95] font-extrabold tracking-[-.035em] [text-wrap:balance]">
              Software house e consultoria, do diagnóstico à sustentação.
            </h2>
          </div>
          <p className="m-0 self-end text-lg leading-relaxed text-mist lg:text-xl">
            Construímos sites, apps, APIs e automações para a sua operação — e cuidamos deles depois da entrega. Os produtos Beara nasceram desse
            trabalho: soluções prontas para delivery, campo e escola.
          </p>
        </div>

        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPAS.map((e, i) => (
            <li
              key={e.n}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              className="relative flex flex-col gap-3 rounded-2xl border border-ink-line p-6"
            >
              <span className="font-mono text-sm text-cyan">{e.n}</span>
              <strong className="font-display text-2xl font-extrabold tracking-[-.02em]">{e.nome}</strong>
              <span className="text-[15px] leading-normal text-mist">{e.texto}</span>
              {i < ETAPAS.length - 1 && (
                <span aria-hidden className="absolute top-1/2 -right-3 z-[1] hidden size-6 -translate-y-1/2 place-items-center rounded-full bg-cyan text-xs text-ink lg:grid">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <div id="servicos" className="flex flex-col gap-6">
          <span className="font-mono text-[13px] text-mist" data-reveal>
            O QUE CONSTRUÍMOS
          </span>
          <div className="flex flex-col border-t border-ink-line">
            {SERVICOS.map((s, i) => (
              <details key={s.tag} className="group border-b border-ink-line" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                <summary className="flex cursor-pointer list-none items-center gap-4 py-5 sm:gap-8 sm:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="w-8 shrink-0 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-8">
                    <span className="shrink-0 font-mono text-xs text-cyan sm:w-48">{s.tag}</span>
                    <span className="font-display text-xl font-extrabold tracking-[-.02em] transition-colors group-hover:text-cyan sm:text-[28px]">{s.titulo}</span>
                  </span>
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-ink-line text-lg transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="m-0 flex list-none flex-col gap-2 pb-6 pl-12 sm:flex-row sm:flex-wrap sm:gap-3 sm:pl-[calc(2rem+2rem+12rem+2rem)]">
                  {s.itens.map((it) => (
                    <li key={it} className="rounded-full border border-ink-line px-4 py-2 text-sm text-mist">
                      {it}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>

      <Stack />
    </section>
  );
}

function Stack() {
  const lista = [...STACK, ...STACK];
  return (
    <div className="relative border-t border-ink-line py-6" aria-label="Tecnologias que usamos">
      <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="animate-marquee m-0 flex shrink-0 list-none gap-10 p-0 pr-10 hover:[animation-play-state:paused]">
          {lista.map((t, i) => (
            <li key={`${t}-${i}`} aria-hidden={i >= STACK.length} className="flex items-center gap-10 font-mono text-sm whitespace-nowrap text-mist">
              {t}
              <span className="size-1.5 rounded-[2px] bg-cyan" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
