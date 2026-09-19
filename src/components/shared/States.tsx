import { Loader2, WifiOff } from "lucide-react";

/** Estados transversais, no mesmo visual das telas. */

export function Loading({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin text-brand" />
      <p className="text-[11px]">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-3.5 mt-3 flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-5 text-center shadow-card">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
        <WifiOff className="h-5 w-5" />
      </span>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-xl bg-brand px-4 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-brand/90"
          type="button"
        >
          Tentar de novo
        </button>
      )}
    </div>
  );
}
