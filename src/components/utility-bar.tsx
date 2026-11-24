import { UTILITARIOS, contato, emailUrl } from "@/content/site";

// Barra fina acima do header. Some no celular (o menu movel cobre o contato).
export function UtilityBar() {
  return (
    <div className="hidden bg-ink text-[13px] text-mist md:block">
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-4 px-[clamp(16px,4vw,40px)] py-2">
        <div className="flex flex-wrap gap-5">
          {UTILITARIOS.esquerda.map((item, i) => (
            <span key={item} className={i === 0 ? "font-semibold text-paper" : undefined}>
              {item}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-5">
          <a href={emailUrl("Suporte")} className="text-mist hover:text-cyan">
            Suporte
          </a>
          <a href={emailUrl()} className="font-mono text-mist hover:text-cyan">
            {contato.email}
          </a>
        </div>
      </div>
    </div>
  );
}
