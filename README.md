# Beara — site institucional

Site da Beara (software house e consultoria) com os produtos Beara Delivery
e Beara Entregas (em breve). Feito a partir do design `Beara_Site` (Claude Design).

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 — o mesmo
stack do `Beara-delivery-app-web`.

## Rodar

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm build
```

Variável opcional: `NEXT_PUBLIC_SITE_URL` (padrão `https://beara.com.br`),
usada nos metadados, Open Graph e sitemap. Veja `.env.example`.

## Estrutura

```
src/
  app/            layout, página, ícone, OG image, robots, sitemap, manifest
  content/site.ts todos os textos, produtos, segmentos e contatos
  components/
    hero.tsx            carrossel com autoplay (6 s), progresso, swipe no celular
    hero-bear-3d.tsx    urso Beara em 3D só com CSS transforms
    site-header.tsx     mega-menu (desktop) e gaveta com acordeão (celular)
    produtos.tsx        abas de produto com prévia
    secoes.tsx          segmentos, sobre, etapas, serviços e faixa de stack
    contato.tsx         formulário que abre o WhatsApp com a mensagem pronta
    cta-movel.tsx       barra fixa de contato no celular
    reveal.tsx          entradas ao rolar
```

## Celular

- Utility bar some; header vira logo + "Fale conosco" + menu hambúrguer.
- Gaveta em tela cheia com Soluções/Segmentos em acordeão e atalho para WhatsApp.
- Hero: deslize para trocar o slide; o urso responde ao toque.
- Abas de produto com rolagem horizontal.
- Barra fixa "Fale com um especialista" aparece depois do hero e some no contato.
- Respeita `safe-area-inset` (iPhone) e `prefers-reduced-motion`.

## Pendências

- O formulário não tem backend: abre o WhatsApp com a mensagem preenchida.
  Para receber por e-mail, falta escolher o serviço de envio.
- Parceiros, Carreiras, Conteúdos, Blog, Privacidade e Termos ainda não têm
  página — aparecem como texto, sem link.
- A prévia do Beara Delivery (`public/produtos/beara-delivery.png`) ainda
  mostra a marca antiga "Bear Delivery". O Beara Entregas aparece só como "em breve".
