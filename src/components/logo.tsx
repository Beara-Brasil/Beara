import { useId } from "react";

// Simbolo Beara: orelhas + quatro blocos com a onda ciano (do design original).
export function BearaMark({ size = 30, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="4 3 87 86" width={size} height={size} className={className} role="img" aria-label="Símbolo Beara">
      <defs>
        <clipPath id={`blt-${id}`}>
          <path d="M15,26 H43.5 Q45,26 45,27.5 V46 Q45,55 36,55 H7.5 Q6,55 6,53.5 V35 Q6,26 15,26 Z M51.5,26 H80 Q89,26 89,35 V53.5 Q89,55 87.5,55 H59 Q50,55 50,46 V27.5 Q50,26 51.5,26 Z M7.5,59 H36 Q45,59 45,68 V85.5 Q45,87 43.5,87 H15 Q6,87 6,78 V60.5 Q6,59 7.5,59 Z M59,59 H87.5 Q89,59 89,60.5 V78 Q89,87 80,87 H51.5 Q50,87 50,85.5 V68 Q50,59 59,59 Z" />
        </clipPath>
      </defs>
      <rect x="6" y="5" width="25" height="18" rx="3" fill="#0F1420" />
      <rect x="64" y="5" width="25" height="18" rx="3" fill="#0F1420" />
      <g clipPath={`url(#blt-${id})`}>
        <rect x="0" y="0" width="100" height="100" fill="#1E3A8A" />
        <path d="M4,86 C22,79 38,64 48,54 S74,32 91,29 L91,95 L4,95 Z" fill="#22D3EE" />
        <path d="M4,86 C22,79 38,64 48,54 S74,32 91,29" fill="none" stroke="#FFFFFF" strokeWidth="2.6" />
      </g>
      <rect x="22" y="38" width="8" height="8" fill="#FFFFFF" />
      <rect x="65" y="38" width="8" height="8" fill="#FFFFFF" />
    </svg>
  );
}

export function BearaLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <BearaMark size={30} />
      <span className={`font-display text-2xl font-extrabold tracking-[.01em] ${inverted ? "text-paper" : "text-ink"}`}>
        BEARA
      </span>
    </span>
  );
}
