import { useCallback, useEffect, useRef, useState } from "react";
import { Home, Bell, ShieldCheck, Settings, type LucideIcon } from "lucide-react";
import glauxLogo from "@/assets/GlauxC.png";
import { AppShell } from "@/components/phone/AppShell";
import { Dashboard } from "@/components/guardian/Dashboard";
import { AlertsList } from "@/components/guardian/AlertsList";
import { SafetyCenter } from "@/components/guardian/SafetyCenter";
import { SettingsView } from "@/components/guardian/Settings";
import { AlertDetail } from "@/components/guardian/AlertDetail";
import { AlertToastStack } from "@/components/shared/AlertToastStack";
import { ErrorState, Loading } from "@/components/shared/States";
import { ApiError, api, type AlertDetailPayload } from "@/api";
import type { AlertItem, DashboardPayload, GuardianSettings, GuardianTab } from "@/data/types";
import { cn } from "@/lib/utils";

const tabs: { id: GuardianTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "alerts", label: "Alertas", icon: Bell },
  { id: "safety", label: "Segurança", icon: ShieldCheck },
  { id: "settings", label: "Configurações", icon: Settings },
];

const POLL_MS = 15_000;

export function App() {
  const [tab, setTab] = useState<GuardianTab>("home");
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[] | null>(null);
  const [settings, setSettings] = useState<GuardianSettings | null>(null);
  const [detail, setDetail] = useState<AlertDetailPayload | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<AlertItem[]>([]);
  const seenAlertIds = useRef<Set<string> | null>(null);

  const message = (err: unknown, fallback: string) =>
    err instanceof ApiError ? err.message : fallback;

  const load = useCallback(async (silent = false) => {
    if (!silent) setError(null);
    try {
      const [dash, list] = await Promise.all([api.dashboard(), api.alerts()]);
      setDashboard(dash);
      setAlerts(list);

      if (seenAlertIds.current === null) {
        // Primeira carga: só registra o que já existe — não é "novo".
        seenAlertIds.current = new Set(list.map((a) => a.id));
      } else {
        const novos = list.filter((a) => !seenAlertIds.current!.has(a.id));
        if (novos.length > 0) {
          for (const a of novos) seenAlertIds.current.add(a.id);
          setToasts((prev) => [...novos, ...prev]);
        }
      }

      if (!silent) setError(null);
    } catch (err) {

      if (!silent) setError(message(err, "Falha ao carregar os alertas."));
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(true), POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (tab !== "settings" || settings) return;
    api.settings().then(setSettings).catch(() => setSettings(null));
  }, [tab, settings]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openAlert = useCallback(
    async (alert: AlertItem) => {
      dismissToast(alert.id);
      setLoadingId(alert.id);
      try {
        setDetail(await api.alert(alert.id));
        // Abrir marca como lido no servidor: recarrega para o badge sumir.
        void load(true);
      } catch (err) {
        setError(message(err, "Falha ao abrir o alerta."));
      } finally {
        setLoadingId(null);
      }
    },
    [load, dismissToast],
  );

  const saveSettings = useCallback(async (next: GuardianSettings) => {
    setSettings(await api.saveSettings(next));
  }, []);

  /** Trocar de aba fecha o detalhe — senão as abas ficam visíveis porém inertes. */
  const goToTab = useCallback((next: GuardianTab) => {
    setDetail(null);
    setTab(next);
  }, []);

  const unread = (alerts ?? []).filter((a) => !a.read).length;

  return (
    <AppShell>
      {/* App bar */}
      <div className="flex h-14 shrink-0 items-center justify-between bg-brand-gradient px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img src={glauxLogo} alt="DIANA" className="h-full w-full object-contain p-0.5" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">DIANA</span>
        </div>
        <div className="relative">
          <Bell className="h-5 w-5 text-white/90" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative flex-1 overflow-hidden">
        <AlertToastStack toasts={toasts} onOpen={(a) => void openAlert(a)} onDismiss={dismissToast} />
        {detail ? (
          <AlertDetail
            analysis={detail.analysis}
            childName={detail.childName}
            detectedTime={detail.detectedTime}
            onBack={() => setDetail(null)}
          />
        ) : (
          <div className="no-scrollbar h-full overflow-y-auto pb-20">
            {error && <ErrorState message={error} onRetry={() => void load()} />}

            {!error && tab === "home" &&
              (dashboard === null ? (
                <Loading />
              ) : (
                <Dashboard
                  data={dashboard}
                  onViewAlerts={() => setTab("alerts")}
                  onOpenAlert={(alert) => void openAlert(alert)}
                />
              ))}

            {!error && tab === "alerts" &&
              (alerts === null ? (
                <Loading />
              ) : (
                <AlertsList
                  alerts={alerts}
                  loadingId={loadingId}
                  onSelect={(alert) => void openAlert(alert)}
                />
              ))}

            {tab === "safety" && <SafetyCenter />}

            {tab === "settings" &&
              (settings === null ? (
                <Loading label="Carregando preferências…" />
              ) : (
                <SettingsView settings={settings} onChange={saveSettings} />
              ))}
          </div>
        )}
      </div>

      {/* Navegação inferior */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-border bg-white/95 px-2 pb-5 pt-1.5 backdrop-blur">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = !detail && tab === id;
          return (
            <button
              key={id}
              onClick={() => goToTab(id)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[9px] font-medium transition",
                active ? "text-brand" : "text-muted-foreground",
              )}
            >
              {id === "alerts" && unread > 0 && !active && (
                <span className="absolute right-1 top-0 h-1.5 w-1.5 rounded-full bg-red-500" />
              )}
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </div>
    </AppShell>
  );
}
