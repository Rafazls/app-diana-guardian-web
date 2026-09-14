import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, ShieldAlert, ChevronDown, BookOpenCheck } from "lucide-react";
import { riskCategories } from "@/data/riskCategories";
import type { Priority } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const headerAccent: Record<Priority, string> = {
  alta: "bg-red-100 text-red-600",
  media: "bg-amber-100 text-amber-600",
  baixa: "bg-sky-100 text-sky-600",
};

const badgeVariant: Record<Priority, "high" | "medium" | "low"> = {
  alta: "high",
  media: "medium",
  baixa: "low",
};

const priorityLabel: Record<Priority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

function CategoryIcon({ priority, className }: { priority: Priority; className?: string }) {
  if (priority === "alta") return <AlertTriangle className={className} />;
  if (priority === "media") return <ShieldAlert className={className} />;
  return <ShieldCheck className={className} />;
}

export function SafetyCenter() {
  const [open, setOpen] = useState<string | null>(riskCategories[0].id);

  return (
    <div className="flex flex-col gap-3 px-3.5 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <BookOpenCheck className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">Central de Segurança</h1>
          <p className="text-[10px] text-muted-foreground">Sinais que a DIANA monitora</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-2">
        {riskCategories.map((cat) => {
          const isOpen = open === cat.id;
          return (
            <div
              key={cat.id}
              className={cn(
                "overflow-hidden rounded-2xl border bg-white shadow-card transition",
                isOpen ? "border-brand/30" : "border-border",
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : cat.id)}
                className="flex w-full items-center gap-2.5 p-3 text-left"
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    headerAccent[cat.priority],
                  )}
                >
                  <CategoryIcon priority={cat.priority} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold leading-tight text-foreground">{cat.name}</p>
                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    Prioridade {priorityLabel[cat.priority].toLowerCase()}
                  </p>
                </div>
                <Badge variant={badgeVariant[cat.priority]}>{priorityLabel[cat.priority]}</Badge>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border bg-[#fafafd] px-3.5 py-3">
                      <p className="text-[10px] leading-relaxed text-muted-foreground">
                        {cat.description}
                      </p>
                      <p className="mt-2.5 text-[9px] font-bold uppercase tracking-wide text-foreground/70">
                        Sinais identificados
                      </p>
                      <ul className="mt-1 flex flex-col gap-1">
                        {cat.examples.map((ex, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-[10px] text-muted-foreground"
                          >
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2.5 text-[9px] font-bold uppercase tracking-wide text-foreground/70">
                        Orientação ao responsável
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
                        {cat.orientation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
