import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Beara — Tecnologia que carrega o peso do seu negócio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const grade = "linear-gradient(rgba(34,211,238,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.18) 1px, transparent 1px)";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1E3A8A", color: "#FFFFFF", padding: 72, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: grade, backgroundSize: "64px 64px", opacity: 0.6 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={72} height={72} alt="" />
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: 2 }}>BEARA</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ fontSize: 24, color: "#22D3EE", fontFamily: "monospace" }}>{">_ SOFTWARE HOUSE · CONSULTORIA"}</span>
            <span style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -2, maxWidth: 900 }}>Tecnologia que carrega o peso do seu negócio.</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 72, top: 72, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={260} height={257} alt="" style={{ opacity: 0.95 }} />
        </div>
      </div>
    ),
    size,
  );
}
