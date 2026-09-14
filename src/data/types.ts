/**
 * Tipos da tela do responsável.
 *
 * Espelham o que o backend devolve — mudou lá, o `typecheck` acusa aqui.
 */
export type Priority = "alta" | "media" | "baixa";

export interface AlertItem {
  id: string;
  title: string;
  child: string;
  time: string;
  priority: Priority;
  read: boolean;
  category: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  priority: Priority;
  description: string;
  examples: string[];
  orientation: string;
}

export type GuardianTab = "home" | "alerts" | "safety" | "settings";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  hint: string;
}

export interface ActivityPoint {
  day: string;
  mensagens: number;
  alertas: number;
}

export interface DashboardPayload {
  stats: DashboardStat[];
  activity: ActivityPoint[];
  recentAlerts: AlertItem[];
}

export interface SettingsItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

export interface GuardianSettings {
  sections: SettingsSection[];
}

export type FeedbackVerdict = "useful" | "false_positive" | "not_sure";
