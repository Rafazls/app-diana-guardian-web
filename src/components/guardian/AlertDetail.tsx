import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Info,
  ChevronDown,
  ShieldAlert,
  Lightbulb,
  CheckCircle2,
  FileText,
  ListOrdered,
  Repeat,
  TrendingUp,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { SignalIcon } from "@/components/shared/SignalIcon";
import { priorityTheme } from "@/components/shared/priorityTheme";
import type { AnalysisResult, ContextualFactor, RiskLevel, RiskPriority, SignalSeverity } from "@/ml/types";
import { riskCategoryLabels } from "@/ml/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AlertDetailProps {
  analysis: AnalysisResult;
  childName?: string;
  detectedTime?: string;
  onBack?: () => void;
}

const levelLabel: Record<RiskLevel, string> = {
  none: "Nenhum",
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
};

const priorityLabel: Record<RiskPriority, string> = {
  low: "Prioridade baixa",
  medium: "Prioridade média",
  high: "Prioridade alta",
};

const severityBadge: Record<SignalSeverity, "high" | "medium" | "low"> = {
  high: "high",
  medium: "medium",
  low: "low",
};

const factorIcons: Record<ContextualFactor["type"], LucideIcon> = {
  content: FileText,
  sequence: ListOrdered,
  frequency: Repeat,
  escalation: TrendingUp,
  combination: Layers,
};

const factorColor: Record<ContextualFactor["type"], string> = {
  content: "text-brand bg-brand/10",
  sequence: "text-cyan-600 bg-cyan-100",
  frequency: "text-amber-600 bg-amber-100",
  escalation: "text-red-600 bg-red-100",
  combination: "text-emerald-600 bg-emerald-100",
};

const fullOrientationSteps = [
  "Preserve os registros da conversa (capturas de tela, horários e nomes de contato) antes de qualquer ação.",
  "Avalie o bloqueio do contato e ajuste as configurações de privacidade e permissões dos aplicativos utilizados.",
  "Converse regularmente sobre segurança digital, sem tornar o tema um tabu para a criança.",
  "Em casos que envolvam risco à integridade, procure ajuda especializada (psicólogos, conselhos tutelares ou autoridades competentes).",
  "Situações de sofrimento emocional intenso podem ser acolhidas por canais de apoio, como o CVV (188, no Brasil).",
];

export function AlertDetail({
  analysis,
  childName,
  detectedTime = "Agora",
  onBack,
}: AlertDetailProps) {
  const [showFullOrientation, setShowFullOrientation] = useState(false);

  const { assessment, explanation } = analysis;
  const topCategory = assessment.categories[0];
  const categoryName = topCategory ? riskCategoryLabels[topCategory.category] : "Risco não especificado";
  const theme = priorityTheme[assessment.priority];

  return (
    <div className="h-full overflow-y-auto bg-[#f6f7fb] pb-24 no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-white/95 px-3 py-2.5 backdrop-blur">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-bold text-foreground">Detalhes do alerta</p>
      </div>

      <div className="px-3.5 pt-3">
        {/* Banner do alerta */}
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${theme.gradient} p-4 text-white shadow-lg ${theme.shadow}`}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/90">
              <span className="h-2 w-2 animate-alert-blink rounded-full bg-white" />
              {priorityLabel[assessment.priority]}
            </div>
            <h2 className="mt-1.5 text-base font-extrabold leading-tight">
              Possível situação de {categoryName.toLowerCase()}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-white/80">
              <span className="font-semibold">Nível: {levelLabel[assessment.level]}</span>
              <span className="opacity-50">·</span>
              <span>Criança: {childName ?? "Criança"}</span>
              <span className="opacity-50">·</span>
              <span>Detectado: {detectedTime}</span>
            </div>
          </div>
        </div>

        {/* Explicação */}
        <div className="mt-3 rounded-2xl border border-border bg-white p-3.5 shadow-card">
          <h3 className="mb-1.5 text-xs font-bold text-foreground">
            Por que recebemos este alerta?
          </h3>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {explanation.summary}
          </p>
        </div>

        {/* Categoria identificada */}
        <h3 className="mt-4 mb-2 px-0.5 text-xs font-bold text-foreground">
          Categoria identificada
        </h3>
        <div className="rounded-2xl border border-border bg-white p-3 shadow-card">
          <div className="flex flex-col gap-2.5">
            {assessment.categories.slice(0, 3).map((pred) => (
              <div key={pred.category}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">
                    {riskCategoryLabels[pred.category]}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {Math.round(pred.probability * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round(pred.probability * 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-brand to-blue-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sinais encontrados */}
        <h3 className="mt-4 mb-2 px-0.5 text-xs font-bold text-foreground">
          Sinais encontrados
        </h3>
        <div className="flex flex-col gap-2">
          {explanation.topSignals.map((signal) => (
            <div key={signal.id} className="flex gap-2.5 rounded-2xl border border-border bg-white p-3 shadow-card">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <SignalIcon icon={signal.type} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-foreground">{signal.title}</p>
                  <Badge variant={severityBadge[signal.severity]}>
                    {signal.severity}
                  </Badge>
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {signal.description}
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-muted-foreground/70">
                  confiança: {Math.round(signal.confidence * 100)}% · {signal.messageIds.length}{" "}
                  {signal.messageIds.length === 1 ? "mensagem" : "mensagens"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contexto */}
        <h3 className="mt-4 mb-2 px-0.5 text-xs font-bold text-foreground">Contexto da análise</h3>
        <div className="flex flex-col gap-2">
          {explanation.contextualFactors.map((factor) => {
            const Icon = factorIcons[factor.type];
            return (
              <div key={factor.type} className="flex gap-2.5 rounded-2xl border border-border bg-white p-3 shadow-card">
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", factorColor[factor.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold text-foreground">{factor.label}</p>
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {factor.contribution}
                    </span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    {factor.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prioridade */}
        <h3 className="mt-4 mb-2 px-0.5 text-xs font-bold text-foreground">Prioridade</h3>
        <div className="rounded-2xl border border-border bg-white p-3 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-foreground">
                {priorityLabel[assessment.priority]}
              </p>
              <p className="text-[9px] text-muted-foreground">
                Nível de risco: {levelLabel[assessment.level]}
              </p>
            </div>
            <Badge
              variant={
                assessment.priority === "high"
                  ? "high"
                  : assessment.priority === "medium"
                    ? "medium"
                    : "low"
              }
            >
              {assessment.score}/100
            </Badge>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${assessment.score}%` }}
              transition={{ duration: 0.5 }}
              className={cn(
                "h-full rounded-full",
                assessment.priority === "high"
                  ? "bg-gradient-to-r from-amber-400 to-red-500"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500",
              )}
            />
          </div>
          <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground">
            {assessment.rationale}
          </p>
        </div>

        {/* Disclaimer — não acusar */}
        <div className="mt-4 flex gap-2.5 rounded-2xl border border-sky-200 bg-sky-50 p-3">
          <Info className="h-4 w-4 shrink-0 text-sky-600" />
          <p className="text-[10px] leading-relaxed text-sky-800">
            <span className="font-bold">Importante:</span> Este alerta representa uma análise
            automatizada de padrões potencialmente preocupantes. Ele não determina, isoladamente,
            que exista uma situação de abuso ou que uma pessoa tenha cometido um crime.
          </p>
        </div>

        {/* Orientação */}
        <div className="mt-4 rounded-2xl border border-border bg-white p-3.5 shadow-card">
          <div className="mb-2 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-bold text-foreground">O que você pode fazer?</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {explanation.recommendedActions.map((action, i) => (
              <div key={i} className="flex gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-[11px] leading-relaxed text-muted-foreground">{action}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowFullOrientation((v) => !v)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-brand/90"
          >
            {showFullOrientation ? "Ocultar orientação completa" : "Ver orientação completa"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", showFullOrientation && "rotate-180")}
            />
          </button>

          <AnimatePresence initial={false}>
            {showFullOrientation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-xl border border-border bg-muted/50 p-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-brand" />
                    <p className="text-[10px] font-bold text-foreground">
                      Guia completo para o responsável
                    </p>
                  </div>
                  <ul className="mt-2 flex flex-col gap-1.5 text-[10px] leading-relaxed text-muted-foreground">
                    {fullOrientationSteps.map((step, i) => (
                      <li key={i} className="flex gap-1.5">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="py-3 text-center text-[9px] text-muted-foreground/70">
          Análise automatizada DIANA · {analysis.model.modelName} {analysis.model.version} ·{" "}
          {analysis.model.environment.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
