import { Contato } from "@/components/contato";
import { CtaMovel } from "@/components/cta-movel";
import { Hero } from "@/components/hero";
import { Produtos } from "@/components/produtos";
import { Reveal } from "@/components/reveal";
import { Segmentos, Sobre } from "@/components/secoes";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UtilityBar } from "@/components/utility-bar";

export default function Home() {
  return (
    <div id="topo" className="flex min-h-screen flex-col">
      <a href="#produtos" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">
        Pular para o conteúdo
      </a>
      <UtilityBar />
      <SiteHeader />
      <main className="flex flex-col">
        <Hero />
        <Produtos />
        <Segmentos />
        <Sobre />
        <Contato />
      </main>
      <SiteFooter />
      <CtaMovel />
      <Reveal />
    </div>
  );
}
