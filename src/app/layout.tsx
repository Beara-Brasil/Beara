import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], weight: ["400", "600", "800"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--font-instrument", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beara.com.br";
const descricao =
  "Software house e consultoria: sites, apps, APIs e automações para a sua operação. Conheça o Beara Delivery, o Beara Agro e o Beara School.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Beara — Tecnologia que carrega o peso do seu negócio", template: "%s | Beara" },
  description: descricao,
  applicationName: "Beara",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Beara",
    title: "Beara — Tecnologia que carrega o peso do seu negócio",
    description: descricao,
  },
  twitter: { card: "summary_large_image", title: "Beara", description: descricao },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* marca que o JS esta ativo antes da pintura (usado pelas entradas ao rolar) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
