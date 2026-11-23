import Link from "next/link";
import { PRODUTOS, SEGMENTOS, contato, whatsappUrl } from "@/content/site";
import { BearaMark } from "./logo";

// Paginas que ainda nao existem ficam como texto (sem link quebrado).
const EMPRESA = [{ nome: "Sobre nós", href: "/#sobre" }, { nome: "Carreiras" }, { nome: "Parceiros" }, { nome: "Blog" }];
const SUPORTE = [
  { nome: "Fale conosco", href: "/#contato" },
  { nome: "WhatsApp", href: whatsappUrl(), externo: true },
  { nome: "Privacidade", href: "/privacidade" },
  { nome: "Termos de serviço", href: "/termos" },
];

type Item = { nome: string; href?: string; externo?: boolean };

function Coluna({ titulo, itens }: { titulo: string; itens: Item[] }) {
  return (
    <div className="flex flex-col gap-3">
      <strong className="text-[15px] text-paper">{titulo}</strong>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {itens.map((i) =>
          <li key={i.nome}>
            {i.href ? (
              <Link href={i.href} {...(i.externo ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="text-mist hover:text-cyan">
                {i.nome}
              </Link>
            ) : (
              <span>{i.nome}</span>
            )}
          </li>,
        )}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-mist">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-12 px-4 pt-16 pb-[max(32px,env(safe-area-inset-bottom))] sm:px-[clamp(16px,4vw,40px)]">
        <div className="grid grid-cols-2 gap-8 text-sm lg:grid-cols-4">
          <Coluna titulo="Soluções" itens={[...PRODUTOS.map((p) => ({ nome: p.nome, href: `/#produto-${p.slug}` })), { nome: "Projetos sob medida", href: "/#servicos" }]} />
          <Coluna titulo="Segmentos" itens={SEGMENTOS.map((s) => ({ nome: s.nome, href: "/#segmentos" }))} />
          <Coluna titulo="Empresa" itens={EMPRESA} />
          <Coluna titulo="Suporte" itens={SUPORTE} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-line pt-6 text-[13px]">
          <span className="flex items-center gap-2.5">
            <BearaMark size={22} />
            <span className="font-display text-xl font-extrabold tracking-[-.03em] text-paper">BEARA</span>
          </span>
          <span className="font-mono text-xs">{contato.email}</span>
          <span>© {new Date().getFullYear()} Beara. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
