import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

// Casca das paginas de texto (privacidade, termos).
export function PaginaLegal({
  tag,
  titulo,
  atualizado,
  secoes,
  outra,
}: {
  tag: string;
  titulo: string;
  atualizado: string;
  secoes: { id: string; titulo: string; corpo: ReactNode }[];
  outra: { href: string; nome: string };
}) {
  return (
    <div id="topo" className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-col">
        <section className="bg-navy text-white">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-4 py-14 sm:px-[clamp(16px,4vw,40px)] sm:py-20">
            <span className="font-mono text-[13px] text-cyan">{tag}</span>
            <h1 className="m-0 font-display text-[clamp(38px,6vw,72px)] leading-[.95] font-extrabold tracking-[-.035em]">{titulo}</h1>
            <span className="font-mono text-xs text-mist">Última atualização: {atualizado}</span>
          </div>
        </section>
        <div className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 py-12 sm:px-[clamp(16px,4vw,40px)] sm:py-16 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Nesta página" className="hidden lg:block">
            <ol className="sticky top-24 m-0 flex list-none flex-col gap-1 border-l border-line p-0 text-sm">
              {secoes.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-slate hover:border-cyan hover:text-ink">
                    <span className="mr-2 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="flex max-w-[72ch] flex-col gap-10 text-[17px] leading-relaxed text-slate [&_a]:font-semibold [&_a]:text-navy [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:m-0 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
            {secoes.map((s, i) => (
              <section key={s.id} id={s.id} className="flex scroll-mt-24 flex-col gap-3">
                <h2 className="m-0 flex items-baseline gap-3 font-display text-2xl font-extrabold tracking-[-.02em] text-ink sm:text-[28px]">
                  <span className="font-mono text-sm font-normal text-navy">{String(i + 1).padStart(2, "0")}</span>
                  {s.titulo}
                </h2>
                <div className="flex flex-col gap-3 [&_p]:m-0">{s.corpo}</div>
              </section>
            ))}
            <div className="flex flex-wrap gap-3 border-t border-line pt-8">
              <Link href="/" className="!no-underline rounded-full bg-ink px-5 py-3 !text-white hover:bg-navy">
                ← Voltar ao site
              </Link>
              <Link href={outra.href} className="!no-underline px-2 py-3">
                {outra.nome} ›
              </Link>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
