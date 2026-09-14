/**
 * Cliente do backend da DIANA.
 *
 * Os tipos aqui são os mesmos que o backend usa para montar a resposta: se o
 * contrato mudar, o `typecheck` quebra antes de a tela quebrar na frente do
 * responsável.
 */
import type {
  AlertItem,
  DashboardPayload,
  FeedbackVerdict,
  GuardianSettings,
} from "@/data/types";
import type { AnalysisResult } from "@/ml/types";

const BASE = import.meta.env.VITE_API_BASE ?? "/api";

/** Erro já traduzido para algo que o responsável entende. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function friendlyMessage(status: number, payload: unknown): string {
  if (status === 503) return "A análise está indisponível no momento.";
  if (status === 404) return "Alerta não encontrado.";
  if (status === 401) return "Acesso não autorizado.";
  if (status === 400) return "Requisição inválida.";

  const message =
    typeof payload === "object" && payload !== null && "message" in payload
      ? String((payload as { message: unknown }).message)
      : "";
  return message || `Falha na comunicação com o servidor (HTTP ${status}).`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    // Backend fora do ar: falha explícita, não tela vazia.
    throw new ApiError("Não foi possível falar com o servidor. Ele está rodando?", 0);
  }

  const payload: unknown = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(friendlyMessage(response.status, payload), response.status);
  return payload as T;
}

export interface AlertDetailPayload {
  analysis: AnalysisResult;
  childName: string;
  detectedTime: string;
}

export const api = {
  dashboard: (): Promise<DashboardPayload> => request<DashboardPayload>("/dashboard"),

  alerts: (): Promise<AlertItem[]> => request<AlertItem[]>("/alerts"),

  alert: (id: string): Promise<AlertDetailPayload> =>
    request<AlertDetailPayload>(`/alerts/${encodeURIComponent(id)}`),

  sendFeedback: (id: string, verdict: FeedbackVerdict, note?: string): Promise<unknown> =>
    request(`/alerts/${encodeURIComponent(id)}/feedback`, {
      method: "POST",
      body: JSON.stringify(note ? { verdict, note } : { verdict }),
    }),

  settings: (): Promise<GuardianSettings> => request<GuardianSettings>("/settings"),

  saveSettings: (settings: GuardianSettings): Promise<GuardianSettings> =>
    request<GuardianSettings>("/settings", { method: "PUT", body: JSON.stringify(settings) }),
};
