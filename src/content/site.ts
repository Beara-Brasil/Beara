// Conteúdo do site em um lugar só. Textos vindos do design original
// (Beara_Site, Claude Design). Para trocar copy, mexa aqui.

export const contato = {
  whatsapp: "5528999481413",
  telefone: "+55 (28) 99948-1413",
  telefoneHref: "tel:+5528999481413",
  email: "contato@bearsystem.com.br",
} as const;

export const whatsappUrl = (texto?: string) =>
  `https://wa.me/${contato.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

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
    label: "Software sob medida",
    tag: ">_ SOFTWARE HOUSE · CONSULTORIA",
    titulo: "Tecnologia que carrega o peso do seu negócio.",
    texto:
      "Sites, apps, APIs e automações construídos para a sua operação — com consultoria do diagnóstico à sustentação.",
    cta: "Fale com um especialista",
    linhas: [
      { k: "deploy", v: "concluído" },
      { k: "uptime", v: "monitorado" },
      { k: "integrações", v: "ativas" },
      { k: "suporte", v: "contínuo" },
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
  {
    label: "Beara Agro",
    tag: ">_ BEARA AGRO",
    titulo: "Gestão do campo sem planilha.",
    texto:
      "Safra, insumos e rotinas da propriedade em um só sistema, integrado ao seu ERP.",
    cta: "Conhecer o Beara Agro",
    produto: 1,
    linhas: [
      { k: "talhão 07", v: "plantio registrado" },
      { k: "insumos", v: "em estoque" },
      { k: "relatório", v: "automático" },
      { k: "sync campo", v: "ok" },
    ],
  },
  {
    label: "Beara School",
    tag: ">_ BEARA SCHOOL",
    titulo: "A escola inteira em uma plataforma.",
    texto:
      "Secretaria, notas, financeiro e comunicação com as famílias, no computador e no celular.",
    cta: "Conhecer o Beara School",
    produto: 2,
    linhas: [
      { k: "matrículas", v: "abertas" },
      { k: "boletim", v: "publicado" },
      { k: "mensalidades", v: "em dia" },
      { k: "aviso aos pais", v: "enviado" },
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
  titulo: string;
  texto: string;
  itens: string[];
};

export const PRODUTOS: Produto[] = [
  {
    slug: "delivery",
    nome: "Beara Delivery",
    url: "beardelivery.vercel.app",
    href: "https://beardelivery.vercel.app",
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
    slug: "agro",
    nome: "Beara Agro",
    url: "beara.agro",
    tag: "AGRONEGÓCIO",
    resumo: "Gestão e automação para o campo.",
    titulo: "Dados do campo em um só lugar.",
    texto:
      "Controle de produção, estoque de insumos e rotinas da propriedade, com integração ao seu ERP.",
    itens: [
      "Controle de safra, talhões e insumos",
      "Automação de rotinas e relatórios",
      "Acesso no campo, mesmo offline",
    ],
  },
  {
    slug: "school",
    nome: "Beara School",
    url: "beara.school",
    tag: "EDUCAÇÃO",
    resumo: "Gestão escolar e comunicação com famílias.",
    titulo: "A escola inteira conectada.",
    texto:
      "Matrículas, notas, frequência, financeiro e comunicação com pais e alunos em uma plataforma.",
    itens: [
      "Secretaria, notas e frequência",
      "Financeiro e mensalidades",
      "App para pais e alunos",
    ],
  },
];

export const SEGMENTOS = [
  { nome: "Varejo", texto: "E-commerce, PDV integrado e gestão de estoque." },
  { nome: "Indústria", texto: "Monitoramento e controle de processos em tempo real." },
  { nome: "Agronegócio", texto: "Automação de rotinas e integração de dados do campo." },
  { nome: "Serviços", texto: "Portais de cliente, agendamento e faturamento." },
  { nome: "Saúde", texto: "Apps de atendimento e integração de prontuários." },
  { nome: "Logística", texto: "Rastreamento, roteirização e integração com ERP." },
].map((s, i) => ({ ...s, num: String(i + 1).padStart(2, "0") }));

// Serviços da software house (vinham como PRODUTOS_OLD no design).
export const SERVICOS = [
  { tag: "DESENVOLVIMENTO WEB", titulo: "Plataformas web rápidas, seguras e escaláveis.", itens: ["E-commerce com estoque e pagamentos integrados", "Portais de cliente e parceiro", "Painéis administrativos sob medida"] },
  { tag: "APPS MOBILE", titulo: "Aplicativos que seus clientes usam de verdade.", itens: ["iOS e Android com React Native", "Notificações, pagamentos e offline", "Publicação e manutenção nas lojas"] },
  { tag: "APIS E INTEGRAÇÕES", titulo: "Seus sistemas conversando entre si.", itens: ["Integração com ERP e CRM", "APIs REST documentadas", "Conectores com sistemas legados"] },
  { tag: "AUTOMAÇÃO", titulo: "Automação que reduz custo operacional.", itens: ["Robôs de processo e rotinas agendadas", "Relatórios e dashboards automáticos", "Monitoramento industrial em tempo real"] },
  { tag: "SUSTENTAÇÃO", titulo: "Seu software cuidado depois da entrega.", itens: ["Infraestrutura AWS e Docker", "Monitoramento e alertas", "Evolução mensal por sprints"] },
];

export const ETAPAS = [
  { n: "01", nome: "Diagnóstico", texto: "Entendemos a operação, os gargalos e o que precisa mudar primeiro." },
  { n: "02", nome: "Projeto", texto: "Escopo, prazos e arquitetura definidos antes da primeira linha de código." },
  { n: "03", nome: "Construção", texto: "Entregas curtas, com preview para você testar a cada etapa." },
  { n: "04", nome: "Sustentação", texto: "Hospedagem, monitoramento e evolução contínua depois da entrega." },
];

export const STACK = ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "AWS", "Docker", "React Native", "MongoDB", "Firebase"];

export const INTERESSES = ["Beara Delivery", "Beara Agro", "Beara School", "Projeto sob medida"];

export const UTILITARIOS = {
  esquerda: ["Para empresas", "Parceiros", "Carreiras", "Conteúdos"],
};

// evento usado pelo menu e pelo hero para abrir uma aba de produto
export const EVENTO_PRODUTO = "beara:produto";

export function abrirProduto(indice: number) {
  window.dispatchEvent(new CustomEvent(EVENTO_PRODUTO, { detail: indice }));
  document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
