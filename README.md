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
pnpm test       # vitest
```

Variáveis (veja `.env.example`):

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública, usada em metadados, Open Graph e sitemap (padrão `https://beara.com.br`) |
| `RESEND_API_KEY` | Chave do Resend para o formulário enviar e-mail. **Segredo**: só na Vercel |
| `CONTATO_PARA` | Quem recebe as mensagens (padrão `contato@beara.com.br`) |
| `CONTATO_DE` | Remetente; precisa ser de domínio verificado no Resend (padrão `Site Beara <onboarding@resend.dev>`) |

Sem `RESEND_API_KEY`, a rota `/api/contato` responde 503 e o formulário oferece
abrir o e-mail da pessoa (`mailto:`) com a mensagem pronta.

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
    contato.tsx         formulário que envia por e-mail (/api/contato); mailto de reserva
    cta-movel.tsx       barra fixa de contato no celular
    reveal.tsx          entradas ao rolar
```

## Celular

- Utility bar some; header vira logo + "Fale conosco" + menu hambúrguer.
- Gaveta em tela cheia com Soluções/Segmentos em acordeão e atalho para o contato.
- Hero: deslize para trocar o slide; o urso responde ao toque.
- Abas de produto com rolagem horizontal.
- Barra fixa "Fale com um especialista" aparece depois do hero e some no contato.
- Respeita `safe-area-inset` (iPhone) e `prefers-reduced-motion`.

## Pendências

- Parceiros, Carreiras, Conteúdos e Blog ainda não têm página — aparecem como
  texto, sem link.
- `/privacidade` e `/termos` são texto-base: revisar com o jurídico e incluir
  razão social e CNPJ.
- A prévia do Beara Delivery foi montada com o rosto do mascote da `dev` do
  `Beara-delivery-app-web` (`public/brand/bear_delivery_icon.png`).
