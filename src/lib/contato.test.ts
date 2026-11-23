import { describe, expect, it } from "vitest";
import { mensagemWhatsapp, montarEmail, validarContato } from "./contato";

const base = { nome: "Ana", email: "ana@empresa.com", interesses: [] };

describe("validarContato", () => {
  it("aceita só nome e e-mail", () => {
    const r = validarContato(base);
    expect(r).toEqual({ ok: true, dados: { nome: "Ana", email: "ana@empresa.com", empresa: undefined, whatsapp: undefined, desafio: undefined, interesses: [] } });
  });

  it("recusa sem nome ou com e-mail inválido", () => {
    expect(validarContato({ ...base, nome: "   " })).toMatchObject({ ok: false });
    expect(validarContato({ ...base, email: "ana@" })).toMatchObject({ ok: false });
    expect(validarContato({ ...base, email: "ana empresa.com" })).toMatchObject({ ok: false });
    expect(validarContato(null)).toMatchObject({ ok: false });
  });

  it("não deixa quebra de linha no e-mail (injeção de cabeçalho)", () => {
    expect(validarContato({ ...base, email: "ana@empresa.com\nBcc: x@y.com" })).toMatchObject({ ok: false });
  });

  it("campo apagado vira vazio, não texto em branco", () => {
    const r = validarContato({ ...base, empresa: "  ", whatsapp: "" });
    expect(r.ok && r.dados.empresa).toBeUndefined();
    expect(r.ok && r.dados.whatsapp).toBeUndefined();
  });

  it("só aceita interesses da lista e sem repetir", () => {
    const r = validarContato({ ...base, interesses: ["Beara Delivery", "Beara Delivery", "Hackear", 3] });
    expect(r.ok && r.dados.interesses).toEqual(["Beara Delivery"]);
  });

  it("corta textos longos demais", () => {
    const r = validarContato({ ...base, desafio: "a".repeat(10000) });
    expect(r.ok && r.dados.desafio?.length).toBe(4000);
  });
});

describe("montarEmail", () => {
  it("escapa HTML vindo do formulário", () => {
    const r = validarContato({ ...base, nome: "<script>x</script>", desafio: '<img src=x onerror="alert(1)">' });
    if (!r.ok) throw new Error();
    const { html, texto } = montarEmail(r.dados);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
    expect(texto).toContain("<script>x</script>");
  });

  it("assunto sem quebra de linha", () => {
    const { assunto } = montarEmail({ nome: "Ana", email: "a@b.co", empresa: "X\nY", interesses: [] });
    expect(assunto).not.toMatch(/[\r\n]/);
  });

  it("mensagem do WhatsApp tem os dados preenchidos", () => {
    const m = mensagemWhatsapp({ nome: "Ana", email: "a@b.co", empresa: "Loja", interesses: ["Beara Delivery"], desafio: "app" });
    expect(m).toContain("Sou Ana, da Loja");
    expect(m).toContain("Interesse: Beara Delivery.");
  });
});
