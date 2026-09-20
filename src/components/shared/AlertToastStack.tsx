import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import type { AlertItem } from "@/data/types";

const alertAccent: Record<AlertItem["priority"], string> = {
  alta: "bg-red-100 text-red-600",
  media: "bg-amber-100 text-amber-600",
  baixa: "bg-sky-100 text-sky-600",
};

interface AlertToastStackProps {
  toasts: AlertItem[];
  onOpen: (alert: AlertItem) => void;
  onDismiss: (id: string) => void;
  durationMs?: number;
}

export function AlertToastStack({
  toasts,
  onOpen,
  onDismiss,
  durationMs = 6000,
}: AlertToastStackProps) {
  const scheduled = useRef(new Set<string>());

  useEffect(() => {
    const timers = toasts
      .filter((t) => !scheduled.current.has(t.id))
      .map((t) => {
        scheduled.current.add(t.id);
        return setTimeout(() => onDismiss(t.id), durationMs);
      });
    return () => timers.forEach(clearTimeout);
  }, [toasts, durationMs, onDismiss]);

  useEffect(() => {
    const ids = new Set(toasts.map((t) => t.id));
    for (const id of scheduled.current) if (!ids.has(id)) scheduled.current.delete(id);
  }, [toasts]);

  const visible = toasts.slice(0, 3);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-30 flex flex-col items-center gap-2 px-3">
      <AnimatePresence initial={false}>
        {visible.map((alert) => (
          <motion.div
            key={alert.id}
            layout
            initial={{ y: -24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            role="button"
            onClick={() => onOpen(alert)}
            className="pointer-events-auto flex w-full max-w-[280px] items-start gap-2 rounded-2xl border border-border bg-white p-3 shadow-card"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${alertAccent[alert.priority]}`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-foreground">{alert.title}</p>
              <p className="truncate text-[10px] text-muted-foreground">{alert.child}</p>
            </div>
            <button
              type="button"
              aria-label="Dispensar"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(alert.id);
              }}
              className="shrink-0 text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
