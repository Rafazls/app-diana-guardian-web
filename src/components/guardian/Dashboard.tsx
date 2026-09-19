import { MessageSquare, BellRing, AlertTriangle, Eye, ChevronRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { AlertItem, DashboardPayload } from "@/data/types";
import { cn } from "@/lib/utils";

interface DashboardProps {
  data: DashboardPayload;
  onViewAlerts: () => void;
  onOpenAlert: (alert: AlertItem) => void;
}

const statIcons = [MessageSquare, BellRing, AlertTriangle, Eye];

const alertAccent: Record<AlertItem["priority"], string> = {
  alta: "bg-red-100 text-red-600",
  media: "bg-amber-100 text-amber-600",
  baixa: "bg-sky-100 text-sky-600",
};

export function Dashboard({ data, onViewAlerts, onOpenAlert }: DashboardProps) {
  const { stats: dashboardStats, activity: activityData, recentAlerts } = data;

  return (
    <div className="flex flex-col gap-3 px-3.5 pt-3">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-foreground">Olá 👋</h1>
        <p className="text-xs text-muted-foreground">Resumo da segurança digital</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 gap-2">
        {dashboardStats.map((stat, i) => {
          const Icon = statIcons[i];
          const isAlert = stat.id === "alerts-today";
          return (
            <div
              key={stat.id}
              className="rounded-2xl border border-border bg-white p-3 shadow-card"
            >
              <div
                className={cn(
                  "mb-2 flex h-8 w-8 items-center justify-center rounded-xl",
                  isAlert ? "bg-red-100 text-red-600" : "bg-brand text-white",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-extrabold leading-none text-foreground">{stat.value}</p>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-[9px] text-muted-foreground/70">{stat.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Gráfico de atividade */}
      <div className="rounded-2xl border border-border bg-white p-3 shadow-card">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">Atividade monitorada</p>
          <span className="text-[9px] text-muted-foreground">últimos 7 dias</span>
        </div>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gradMsgs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(219 55% 40%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(219 55% 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 9, fill: "hsl(242 12% 45%)" }} />
              <Tooltip
                cursor={{ stroke: "hsl(219 55% 40% / 0.3)" }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 11,
                  fontFamily: "Inter, sans-serif",
                }}
                formatter={(value) => [`${value} mensagens`, "Analisadas"]}
              />
              <Area
                type="monotone"
                dataKey="mensagens"
                stroke="hsl(219 55% 40%)"
                strokeWidth={2}
                fill="url(#gradMsgs)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alertas recentes */}
      <div className="rounded-2xl border border-border bg-white p-3 shadow-card">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-bold text-foreground">Alertas recentes</p>
          <button
            onClick={onViewAlerts}
            className="flex items-center gap-0.5 text-[10px] font-semibold text-brand"
          >
            Ver todos <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          {recentAlerts.length === 0 && (
            <p className="py-4 text-center text-[10px] text-muted-foreground">
              Nenhum alerta no momento.
            </p>
          )}
          {recentAlerts.map((alert) => (
            <button
              key={alert.id}
              onClick={() => onOpenAlert(alert)}
              className="flex w-full items-center gap-2.5 rounded-xl border border-border/70 bg-[#fafafd] px-2.5 py-2 text-left transition hover:border-brand/30"
              type="button"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  alertAccent[alert.priority],
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-foreground">{alert.title}</p>
                <p className="text-[9px] text-muted-foreground">
                  {alert.child} · {alert.time}
                </p>
              </div>
              {!alert.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />}
            </button>
          ))}
        </div>
      </div>

      <p className="pb-1 text-center text-[9px] text-muted-foreground/70">
        Análise automatizada · DIANA
      </p>
    </div>
  );
}
