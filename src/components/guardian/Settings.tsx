import { useState } from "react";
import { Settings, ChevronRight, ShieldCheck, Check } from "lucide-react";
import type { GuardianSettings } from "@/data/types";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** Itens que abrem outra tela em vez de alternar (ainda não implementados). */
const linkIds = new Set(["perfil", "crianca", "notificacoes"]);

interface SettingsViewProps {
  settings: GuardianSettings;
  onChange: (settings: GuardianSettings) => Promise<void>;
}

export function SettingsView({ settings, onChange }: SettingsViewProps) {
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Salva na hora do clique: um painel de preferências com botão "salvar" que o
   * responsável esquece de apertar é pior do que não ter o ajuste.
   */
  async function toggle(sectionId: string, itemId: string, value: boolean) {
    const next: GuardianSettings = {
      sections: settings.sections.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, enabled: value } : item,
              ),
            },
      ),
    };

    setSaving(itemId);
    setError(null);
    try {
      await onChange(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch {
      setError("Não foi possível salvar. Tente de novo.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 px-3.5 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <Settings className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">Configurações</h1>
          <p className="text-[10px] text-muted-foreground">Preferências da conta</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-[9px] font-semibold text-success">
            <Check className="h-3 w-3" /> salvo
          </span>
        )}
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[10px] text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pb-2">
        {settings.sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-border bg-white shadow-card">
            <div className="flex items-center gap-1.5 border-b border-border px-3.5 py-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              <p className="text-[11px] font-bold text-foreground">{section.title}</p>
            </div>
            <div className="flex flex-col">
              {section.items.map((item, i) => {
                const isLink = linkIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-2.5",
                      i < section.items.length - 1 && "border-b border-border/60",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground">{item.description}</p>
                    </div>
                    {isLink ? (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Switch
                        checked={item.enabled}
                        disabled={saving === item.id}
                        onCheckedChange={(v) => void toggle(section.id, item.id, v)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="pb-2 text-center text-[9px] text-muted-foreground/70">
        Análise automatizada · DIANA
      </p>
    </div>
  );
}
