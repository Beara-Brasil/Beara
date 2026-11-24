// Conteúdo do site em um lugar só. Textos vindos do design original
// (Beara_Site, Claude Design). Para trocar copy, mexa aqui.

export const contato = {
  email: "contato@beara.com.br",
} as const;

// link de e-mail, opcionalmente com assunto e texto ja preenchidos
export const emailUrl = (assunto?: string, corpo?: string) => {
  const q = [assunto && `subject=${encodeURIComponent(assunto)}`, corpo && `body=${encodeURIComponent(corpo)}`].filter(Boolean).join("&");
  return `mailto:${contato.email}${q ? `?${q}` : ""}`;
};

export type Linha = { k: string; v: string };

export type Slide = {
  label: string;
  tag: string;
  titulo: string;
  texto: string;
  cta: string;
  // indice do produto em PRODUTOS que o CTA abre; ausente = vai para o contato
  produto?: number;
  linhas: Linha[];
};

export const SLIDES: Slide[] = [
  {
    label: "Beara",
    tag: ">_ BEARA · DELIVERY E LOGÍSTICA",
    titulo: "Tecnologia que carrega o peso do seu negócio.",
    texto: "Produtos para quem vende e entrega: o Beara Delivery já está no ar, e o Beara Entregas chega em breve.",
    cta: "Conhecer os produtos",
    produto: 0,
    linhas: [
      { k: "beara delivery", v: "no ar" },
      { k: "beara entregas", v: "em breve" },
    ],
  },
  {
    label: "Beara Delivery",
    tag: ">_ BEARA DELIVERY",
    titulo: "As lojas da cidade, na porta em 35 min.",
    texto:
      "Um marketplace de delivery com frete e prazo certos para cada endereço, e promoções que fazem o cliente voltar.",
    cta: "Conhecer o Beara Delivery",
    produto: 0,
    linhas: [
      { k: "pedido nº 1042", v: "saiu para entrega" },
      { k: "cardápio", v: "atualizado" },
      { k: "pagamento", v: "aprovado" },
      { k: "tempo médio", v: "32 min" },
    ],
  },
];

export type Produto = {
  slug: string;
  nome: string;
  url: string;
  href?: string;
  img?: string;
  tag: string;
  resumo: string;
  // produto ainda sem lancamento: mostra so nome + "em breve"
  emBreve?: boolean;
  titulo?: string;
  texto?: string;
  itens?: string[];
};

export const PRODUTOS: Produto[] = [
  {
    slug: "delivery",
    nome: "Beara Delivery",
    url: "bearadelivery.com.br",
    href: "https://bearadelivery.com.br",
    img: "/produtos/beara-delivery.png",
    tag: "DELIVERY",
    resumo: "Marketplace de delivery com as lojas da cidade.",
    titulo: "As lojas da cidade num só app de delivery.",
    texto:
      "O cliente informa o endereço, vê as lojas que entregam até ele e recebe em até 35 minutos.",
    itens: [
      "Lojas filtradas por endereço e localização",
      "Frete e tempo de entrega calculados",
      "Promoções: frete grátis e desconto progressivo",
    ],
  },
  {
    slug: "entregas",
    nome: "Beara Entregas",
    url: "beara.com.br",
    tag: "ENTREGAS",
    resumo: "Em breve.",
    emBreve: true,
  },
];

export const SEGMENTOS = [
  { nome: "Delivery", texto: "Lojas da cidade num só app, com frete e prazo calculados para cada endereço." },
  { nome: "Logística", texto: "Rastreamento, roteirização e integração com ERP." },
].map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));

export const INTERESSES = ["Beara Delivery", "Beara Entregas"];

// evento usado pelo menu e pelo hero para abrir uma aba de produto
export const EVENTO_PRODUTO = "beara:produto";

export function abrirProduto(indice: number) {
  const secao = document.getElementById("produtos");
  // fora da home (privacidade, termos): navega para a home ja na aba certa
  if (!secao) {
    window.location.assign(`/#produto-${PRODUTOS[indice]?.slug ?? ""}`);
    return;
  }
  window.dispatchEvent(new CustomEvent(EVENTO_PRODUTO, { detail: indice }));
  secao.scrollIntoView({ behavior: "smooth", block: "start" });
}
