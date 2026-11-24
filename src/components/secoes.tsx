import { SEGMENTOS } from "@/content/site";

export function Segmentos() {
  return (
    <section id="segmentos" className="bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-10 px-4 py-16 sm:px-[clamp(16px,4vw,40px)] sm:py-[clamp(64px,8vw,112px)]">
        <div className="flex max-w-[720px] flex-col gap-3" data-reveal>
          <span className="font-mono text-[13px] text-navy">&gt;_ SEGMENTOS</span>
          <h2 className="m-0 font-display text-[clamp(32px,4.5vw,56px)] leading-none font-extrabold tracking-[-.03em]">
            Feito para quem vende e entrega.
          </h2>
        </div>
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[20px] border border-line bg-line p-0 sm:grid-cols-2">
          {SEGMENTOS.map((s, i) => (
            <li
              key={s.nome}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
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
      <div className="relative mx-auto grid max-w-[1320px] gap-8 px-4 py-16 sm:px-[clamp(16px,4vw,40px)] sm:py-[clamp(64px,8vw,112px)] lg:grid-cols-2 lg:gap-12" data-reveal>
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[13px] text-cyan">&gt;_ SOBRE A BEARA</span>
          <h2 className="m-0 font-display text-[clamp(34px,5vw,64px)] leading-[.95] font-extrabold tracking-[-.035em] [text-wrap:balance]">
            Tecnologia para delivery e logística.
          </h2>
        </div>
        <p className="m-0 self-end text-lg leading-relaxed text-mist lg:text-xl">
          A Beara cria produtos para quem vende e entrega. O Beara Delivery já conecta as lojas da cidade aos clientes, e o Beara Entregas chega em
          breve.
        </p>
      </div>
    </section>
  );
}
