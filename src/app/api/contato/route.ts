import { NextResponse } from "next/server";
import { montarEmail, validarContato } from "@/lib/contato";
import { limiteContato } from "@/lib/limite";

// Recebe o formulario de contato e envia por e-mail via Resend (API HTTP).
// Nada e gravado: o dado so passa por aqui a caminho da caixa de e-mail.
//
// Variaveis de ambiente (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY  chave do Resend (segredo; nunca NEXT_PUBLIC_)
//   CONTATO_PARA    quem recebe            (padrao: contato@beara.com.br)
//   CONTATO_DE      remetente verificado   (padrao: Site Beara <onboarding@resend.dev>)
// Sem RESEND_API_KEY a rota responde 503 e o formulario oferece o WhatsApp.

export const runtime = "nodejs";

const PARA = () => process.env.CONTATO_PARA || "contato@beara.com.br";
const DE = () => process.env.CONTATO_DE || "Site Beara <onboarding@resend.dev>";

export async function POST(req: Request) {
  let corpo: Record<string, unknown>;
  try {
    corpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "Requisição inválida." }, { status: 400 });
  }

  // campo escondido: gente nao preenche, robo preenche. Finge sucesso.
  if (typeof corpo.site === "string" && corpo.site.trim()) return NextResponse.json({ ok: true });

  const v = validarContato(corpo);
  if (!v.ok) return NextResponse.json({ ok: false, erro: v.erro }, { status: 422 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido";
  if (limiteContato.excedeu(ip)) {
    return NextResponse.json({ ok: false, erro: "Muitas mensagens seguidas. Tente de novo em alguns minutos." }, { status: 429 });
  }

  const chave = process.env.RESEND_API_KEY;
  if (!chave) return NextResponse.json({ ok: false, erro: "Não conseguimos enviar por e-mail agora. Mande pelo WhatsApp, já com tudo preenchido:" }, { status: 503 });

  const { assunto, texto, html } = montarEmail(v.dados);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: DE(), to: [PARA()], reply_to: v.dados.email, subject: assunto, text: texto, html }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) {
      // loga so o status e a resposta do Resend, nunca os dados da pessoa
      console.error("[contato] Resend respondeu", r.status, (await r.text()).slice(0, 300));
      return NextResponse.json({ ok: false, erro: "Não conseguimos enviar por e-mail agora. Mande pelo WhatsApp, já com tudo preenchido:" }, { status: 502 });
    }
  } catch (err) {
    console.error("[contato] falha ao chamar o Resend", (err as Error).name);
    return NextResponse.json({ ok: false, erro: "Não conseguimos enviar por e-mail agora. Mande pelo WhatsApp, já com tudo preenchido:" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
