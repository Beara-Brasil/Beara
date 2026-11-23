// Geometria do simbolo Beara, compartilhada pelas versoes 3D e leve do urso.

export type Parte = {
  x: number; y: number; w: number; h: number;
  r: number | [number, number, number, number];
  d: [number, number];
  z: number;
  orelha?: boolean;
};

export const PARTES: Parte[] = [
  { x: 6, y: 5, w: 25, h: 18, r: 3, d: [-1, -1.4], z: 1.3, orelha: true },
  { x: 64, y: 5, w: 25, h: 18, r: 3, d: [1, -1.4], z: 1.3, orelha: true },
  { x: 6, y: 26, w: 39, h: 29, r: [9, 1.5, 9, 1.5], d: [-1, -0.6], z: 0.6 },
  { x: 50, y: 26, w: 39, h: 29, r: [1.5, 9, 1.5, 9], d: [1, -0.6], z: 1 },
  { x: 6, y: 59, w: 39, h: 28, r: [1.5, 9, 1.5, 9], d: [-1, 0.8], z: 1 },
  { x: 50, y: 59, w: 39, h: 28, r: [9, 1.5, 9, 1.5], d: [1, 0.8], z: 0.6 },
];
export const S = 4.4;
export const LARGURA = 87 * S;
export const ALTURA = 86 * S;

export const raio = (p: Parte) => (Array.isArray(p.r) ? p.r.map((v) => `${v * S}px`).join(" ") : `${p.r * S}px`);

// Recorte do logo visto por cada bloco (o SVG inteiro deslocado).
export function FaceLogo({
  p,
  olhoRef,
  olhoClassName,
}: {
  p: Parte;
  olhoRef?: (el: SVGRectElement | null) => void;
  olhoClassName?: string;
}) {
  const olho = { fill: "#1E3A8A", ref: olhoRef, className: olhoClassName, style: { transformBox: "fill-box" as const, transformOrigin: "center" } };
  return (
    <svg
      viewBox="4 3 87 86"
      width={LARGURA}
      height={ALTURA}
      style={{ position: "absolute", left: -(p.x - 4) * S, top: -(p.y - 3) * S }}
      aria-hidden
    >
      <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
      <path d="M4,86 C22,79 38,64 48,54 S74,32 91,29 L91,95 L4,95 Z" fill="#22D3EE" />
      <path d="M4,86 C22,79 38,64 48,54 S74,32 91,29" fill="none" stroke="#1E3A8A" strokeWidth="2.6" />
      <rect x="22" y="38" width="8" height="8" {...olho} />
      <rect x="65" y="38" width="8" height="8" {...olho} />
    </svg>
  );
}
