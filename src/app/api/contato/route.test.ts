import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { limiteContato } from "@/lib/limite";
import { POST } from "./route";

const pedir = (corpo: unknown, ip = "1.1.1.1") =>
  POST(new Request("http://x/api/contato", { method: "POST", headers: { "x-forwarded-for": ip }, body: typeof corpo === "string" ? corpo : JSON.stringify(corpo) }));

const valido = { nome: "Ana", email: "ana@empresa.com", interesses: ["Beara Delivery"], desafio: "quero um app" };

describe("POST /api/contato", () => {
  const fetchMock = vi.fn();
  beforeEach(() => {
    limiteContato.limpar();
    fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("CONTATO_PARA", "contato@beara.com.br");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("envia pelo Resend com resposta direto para quem escreveu", async () => {
    const r = await pedir(valido);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_teste");
    const enviado = JSON.parse(init.body);
    expect(enviado.to).toEqual(["contato@beara.com.br"]);
    expect(enviado.reply_to).toBe("ana@empresa.com");
    expect(enviado.subject).toContain("Ana");
  });

  it("recusa dado inválido sem chamar o Resend", async () => {
    const r = await pedir({ ...valido, email: "x" });
    expect(r.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("recusa corpo que não é JSON", async () => {
    expect((await pedir("{quebrado")).status).toBe(400);
  });

  it("robô que preenche o campo escondido recebe ok, mas nada é enviado", async () => {
    const r = await pedir({ ...valido, site: "http://spam" });
    expect(r.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sem chave configurada responde 503 (o formulário oferece o WhatsApp)", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await pedir(valido)).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falha do Resend vira 502 e não vaza os dados no log", async () => {
    fetchMock.mockResolvedValue(new Response("dominio nao verificado", { status: 403 }));
    const r = await pedir(valido);
    expect(r.status).toBe(502);
    const log = JSON.stringify((console.error as unknown as ReturnType<typeof vi.fn>).mock.calls);
    expect(log).not.toContain("ana@empresa.com");
  });

  it("limita a 5 mensagens por IP em 10 minutos", async () => {
    for (let i = 0; i < 5; i++) expect((await pedir(valido)).status).toBe(200);
    expect((await pedir(valido)).status).toBe(429);
    expect((await pedir(valido, "2.2.2.2")).status).toBe(200);
  });
});
