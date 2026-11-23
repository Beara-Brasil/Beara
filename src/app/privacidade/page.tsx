import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal } from "@/components/pagina-legal";
import { contato, whatsappUrl } from "@/content/site";

// Texto-base escrito a partir do que o site faz hoje (formulario -> WhatsApp,
// sem cookies de rastreamento). Revisar com o juridico e incluir razao social e
// CNPJ antes de tratar como versao final.

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Beara trata os dados pessoais de quem visita o site e entra em contato.",
  alternates: { canonical: "/privacidade" },
};

const email = <a href={`mailto:${contato.email}`}>{contato.email}</a>;

export default function Privacidade() {
  return (
    <PaginaLegal
      tag=">_ LGPD · LEI 13.709/2018"
      titulo="Política de Privacidade"
      atualizado="23 de novembro de 2026"
      outra={{ href: "/termos", nome: "Termos de serviço" }}
      secoes={[
        {
          id: "quem-somos",
          titulo: "Quem somos",
          corpo: (
            <>
              <p>
                Esta política explica como a <strong>Beara</strong>, responsável pelo site <strong>beara.com.br</strong>, trata os dados pessoais de quem
                visita o site e entra em contato com a gente, conforme a Lei Geral de Proteção de Dados (LGPD).
              </p>
              <p>
                Ela vale para este site institucional. Os produtos da Beara, como o <a href="https://bearadelivery.com.br">Beara Delivery</a>, têm políticas
                próprias, disponíveis em cada produto.
              </p>
            </>
          ),
        },
        {
          id: "dados",
          titulo: "Quais dados tratamos",
          corpo: (
            <>
              <p>
                <strong>Dados que você nos envia.</strong> Ao usar o formulário de contato, você informa nome, empresa, e-mail, WhatsApp, os produtos de
                interesse e a descrição do seu desafio. Só nome e e-mail são obrigatórios.
              </p>
              <p>
                Ao enviar, essas informações são mandadas por e-mail para a nossa caixa de contato. O site <strong>não guarda os dados</strong> em banco
                de dados nem no seu navegador: eles só passam pelo servidor a caminho do e-mail. Se o envio por e-mail falhar, o site oferece abrir o
                WhatsApp com a mensagem pronta, e aí os dados só chegam até nós se você decidir enviar. O mesmo vale quando você nos escreve por
                e-mail ou WhatsApp diretamente.
              </p>
              <p>
                <strong>Dados técnicos de acesso.</strong> Como todo site, o nosso provedor de hospedagem registra dados técnicos das visitas, como endereço
                IP, data e hora, página acessada e tipo de navegador. Esses registros são usados para manter o site funcionando com segurança e são
                guardados pelo prazo exigido pelo Marco Civil da Internet (Lei 12.965/2014).
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          titulo: "Cookies",
          corpo: (
            <p>
              Este site não usa cookies de publicidade nem ferramentas de análise que rastreiam você. As fontes e imagens são servidas pelo próprio site.
              Se isso mudar, esta política será atualizada antes.
            </p>
          ),
        },
        {
          id: "finalidade",
          titulo: "Para que usamos",
          corpo: (
            <>
              <p>Usamos os dados de contato para:</p>
              <ul>
                <li>responder à sua mensagem e entender o seu desafio;</li>
                <li>preparar e enviar propostas e demonstrações que você pediu;</li>
                <li>dar continuidade ao atendimento, se você virar cliente.</li>
              </ul>
              <p>
                A base legal é a execução de procedimentos preliminares a um contrato, a seu pedido (art. 7º, V, da LGPD), e o nosso legítimo interesse em
                responder quem nos procura (art. 7º, IX). Não usamos seus dados para decisões automatizadas nem enviamos propaganda sem sua permissão.
              </p>
            </>
          ),
        },
        {
          id: "compartilhamento",
          titulo: "Com quem compartilhamos",
          corpo: (
            <>
              <p>
                <strong>Não vendemos nem alugamos dados pessoais.</strong> Eles passam apenas pelos serviços necessários para o atendimento:
              </p>
              <ul>
                <li>o Resend, serviço que entrega para a nossa caixa as mensagens enviadas pelo formulário;</li>
                <li>o nosso provedor de e-mail, onde as mensagens ficam guardadas para o atendimento;</li>
                <li>o WhatsApp (Meta), quando você escolhe falar com a gente por lá;</li>
                <li>o provedor de hospedagem do site, para os dados técnicos de acesso.</li>
              </ul>
              <p>Também podemos compartilhar dados quando a lei ou uma autoridade competente exigir.</p>
            </>
          ),
        },
        {
          id: "retencao",
          titulo: "Por quanto tempo guardamos",
          corpo: (
            <p>
              Guardamos os dados de contato enquanto forem necessários para o atendimento ou para a relação comercial. Depois disso, eles são eliminados,
              exceto quando precisarmos mantê-los para cumprir uma obrigação legal ou exercer direitos em processo.
            </p>
          ),
        },
        {
          id: "direitos",
          titulo: "Seus direitos",
          corpo: (
            <>
              <p>Pela LGPD (art. 18), você pode, a qualquer momento:</p>
              <ul>
                <li>confirmar se tratamos seus dados e ter acesso a eles;</li>
                <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários;</li>
                <li>pedir a portabilidade dos dados;</li>
                <li>saber com quem compartilhamos seus dados;</li>
                <li>revogar o consentimento, quando ele for a base do tratamento.</li>
              </ul>
              <p>
                Para exercer qualquer um deles, escreva para {email}. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </>
          ),
        },
        {
          id: "seguranca",
          titulo: "Segurança",
          corpo: (
            <p>
              O site é servido apenas por conexão segura (HTTPS) e usamos medidas técnicas e administrativas para proteger os dados contra acesso não
              autorizado, perda ou alteração. Nenhum sistema é totalmente imune a falhas; se houver um incidente que possa trazer risco a você,
              avisaremos você e a ANPD, como a lei determina.
            </p>
          ),
        },
        {
          id: "criancas",
          titulo: "Crianças e adolescentes",
          corpo: <p>Este site é voltado a empresas e não foi feito para coletar dados de crianças e adolescentes.</p>,
        },
        {
          id: "alteracoes",
          titulo: "Mudanças nesta política",
          corpo: (
            <p>
              Podemos atualizar esta política quando o site ou a lei mudarem. A data no topo indica a versão em vigor. Mudanças relevantes serão
              destacadas aqui.
            </p>
          ),
        },
        {
          id: "fale-conosco",
          titulo: "Fale com a gente",
          corpo: (
            <p>
              Dúvidas sobre privacidade: {email} ou <a href={whatsappUrl()}>WhatsApp {contato.telefone}</a>. Veja também os{" "}
              <Link href="/termos">Termos de serviço</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
