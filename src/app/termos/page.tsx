import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/pagina-legal";
import { contato } from "@/content/site";

// Texto-base. Revisar com o juridico e incluir razao social e CNPJ antes de
// tratar como versao final.

export const metadata: Metadata = {
  title: "Termos de serviço",
  description: "Regras de uso do site institucional da Beara.",
  alternates: { canonical: "/termos" },
};

export default function Termos() {
  return (
    <PaginaLegal
      tag=">_ TERMOS DE USO"
      titulo="Termos de serviço"
      atualizado="23 de novembro de 2026"
      outra={{ href: "/privacidade", nome: "Política de Privacidade" }}
      secoes={[
        {
          id: "aceite",
          titulo: "Sobre estes termos",
          corpo: (
            <p>
              Estes termos regulam o uso do site <strong>beara.com.br</strong>, mantido pela <strong>Beara</strong>. Ao navegar pelo site, você concorda
              com eles. Se não concordar, por favor não use o site.
            </p>
          ),
        },
        {
          id: "site",
          titulo: "O que é este site",
          corpo: (
            <p>
              Este é o site institucional da Beara. Ele apresenta nossos serviços de desenvolvimento de software e consultoria e os nossos produtos, e
              oferece canais para você falar com a gente. O conteúdo é informativo e pode mudar sem aviso.
            </p>
          ),
        },
        {
          id: "produtos-beara",
          titulo: "Produtos Beara",
          corpo: (
            <p>
              Cada produto tem os próprios termos de uso e política de privacidade. O uso do <a href="https://bearadelivery.com.br">Beara Delivery</a>,
              por exemplo, segue as regras publicadas em bearadelivery.com.br. Produtos marcados como &quot;em breve&quot; ainda não estão disponíveis, e
              as informações sobre eles podem mudar até o lançamento.
            </p>
          ),
        },
        {
          id: "propostas",
          titulo: "Contato e propostas",
          corpo: (
            <>
              <p>
                Enviar uma mensagem pelo formulário ou por e-mail não cria contrato nem obrigação para nenhuma das partes. Prazos de
                resposta citados no site são uma meta de atendimento, não uma garantia.
              </p>
              <p>
                Projetos, preços, prazos e níveis de serviço são definidos em proposta e contrato próprios, que prevalecem sobre qualquer informação
                deste site.
              </p>
            </>
          ),
        },
        {
          id: "uso",
          titulo: "Uso adequado",
          corpo: (
            <>
              <p>Ao usar o site, você se compromete a não:</p>
              <ul>
                <li>tentar acessar áreas, sistemas ou dados sem autorização;</li>
                <li>prejudicar o funcionamento do site, por exemplo com envios automatizados em massa;</li>
                <li>enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros;</li>
                <li>se passar por outra pessoa ou empresa.</li>
              </ul>
            </>
          ),
        },
        {
          id: "propriedade",
          titulo: "Propriedade intelectual",
          corpo: (
            <p>
              A marca Beara, o símbolo, o mascote, os textos, as imagens e o código do site pertencem à Beara ou são usados com autorização. Não é
              permitido copiar, modificar ou usar esse material para fins comerciais sem autorização por escrito. As marcas de tecnologias citadas
              (como React, AWS e Docker) pertencem aos seus donos.
            </p>
          ),
        },
        {
          id: "links",
          titulo: "Links para outros sites",
          corpo: (
            <p>
              O site pode ter links para sites e serviços de terceiros. Não controlamos esses serviços e não respondemos pelo conteúdo ou pelas
              práticas deles. Ao usá-los, valem os termos de cada um.
            </p>
          ),
        },
        {
          id: "responsabilidade",
          titulo: "Disponibilidade e responsabilidade",
          corpo: (
            <p>
              Trabalhamos para manter o site no ar e as informações corretas, mas ele pode passar por manutenção, falhas ou desatualizações. Na medida
              permitida pela lei, a Beara não responde por danos causados por indisponibilidade do site ou por decisões tomadas só com base no
              conteúdo dele, sem uma proposta formal.
            </p>
          ),
        },
        {
          id: "privacidade",
          titulo: "Privacidade",
          corpo: (
            <p>
              O tratamento de dados pessoais segue a nossa <Link href="/privacidade">Política de Privacidade</Link>, que faz parte destes termos.
            </p>
          ),
        },
        {
          id: "alteracoes",
          titulo: "Mudanças nestes termos",
          corpo: <p>Podemos atualizar estes termos a qualquer momento. A data no topo indica a versão em vigor.</p>,
        },
        {
          id: "lei",
          titulo: "Lei aplicável",
          corpo: (
            <p>
              Estes termos seguem a lei brasileira. Quando você for consumidor, vale o foro do seu domicílio, conforme o Código de Defesa do
              Consumidor. Dúvidas: <a href={`mailto:${contato.email}`}>{contato.email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
