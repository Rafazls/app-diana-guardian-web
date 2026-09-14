import type { RiskPriority } from "@/ml/types";

/**
 * Tema visual por prioridade de alerta — garante que cada alerta apareça com a
 * sua cor correspondente (alta = vermelho, média = âmbar, baixa = azul).
 *
 * As classes ficam declaradas como strings literais para que o Tailwind as
 * inclua no bundle.
 */
export interface PriorityTheme {
  label: string;
  gradient: string;
  softBg: string;
  softBorder: string;
  textStrong: string;
  textSoft: string;
  solidBg: string;
  button: string;
  dot: string;
  shadow: string;
}

export const priorityTheme: Record<RiskPriority, PriorityTheme> = {
  high: {
    label: "Prioridade alta",
    gradient: "from-red-500 to-red-600",
    softBg: "bg-red-50",
    softBorder: "border-red-200",
    textStrong: "text-red-700",
    textSoft: "text-red-600",
    solidBg: "bg-red-500",
    button: "bg-red-500 hover:bg-red-600",
    dot: "bg-red-500",
    shadow: "shadow-red-900/10",
  },
  medium: {
    label: "Prioridade média",
    gradient: "from-amber-500 to-amber-600",
    softBg: "bg-amber-50",
    softBorder: "border-amber-200",
    textStrong: "text-amber-700",
    textSoft: "text-amber-600",
    solidBg: "bg-amber-500",
    button: "bg-amber-500 hover:bg-amber-600",
    dot: "bg-amber-500",
    shadow: "shadow-amber-900/10",
  },
  low: {
    label: "Prioridade baixa",
    gradient: "from-sky-500 to-sky-600",
    softBg: "bg-sky-50",
    softBorder: "border-sky-200",
    textStrong: "text-sky-700",
    textSoft: "text-sky-600",
    solidBg: "bg-sky-500",
    button: "bg-sky-500 hover:bg-sky-600",
    dot: "bg-sky-500",
    shadow: "shadow-sky-900/10",
  },
};
