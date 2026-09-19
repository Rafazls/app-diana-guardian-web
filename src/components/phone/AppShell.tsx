import { Signal, Wifi, BatteryMedium } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

/** Relógio da barra de status falsa (só aparece no desktop). */
function useClock(): string {
  const format = () =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const [time, setTime] = useState(format);

  useEffect(() => {
    const timer = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(timer);
  }, []);

  return time;
}

/**
 * Moldura do app, responsiva.
 *
 * No celular — onde o app realmente vive — ocupa a tela inteira, sem bezel nem
 * barra de status falsa (competir com a barra real do sistema só confunde).
 * A partir de `sm`, vira o smartphone virtual exatamente como a tela é
 * apresentada na landing page.
 *
 * O conteúdo é renderizado UMA vez: as duas aparências são o mesmo DOM com
 * classes diferentes. Duplicar a árvore por breakpoint duplicaria também o
 * estado e os timers do app.
 */
export function AppShell({ children }: AppShellProps) {
  const time = useClock();

  return (
    <div className="min-h-[100dvh] bg-[#f6f7fb] sm:flex sm:items-center sm:justify-center sm:bg-hero sm:p-6">
      {/* Corpo do aparelho (bezel) — só desenha a partir de sm. */}
      <div className="relative h-[100dvh] w-full sm:h-[680px] sm:max-h-[88vh] sm:w-[340px] sm:shrink-0 sm:rounded-[2.8rem] sm:border-[6px] sm:border-black sm:bg-black sm:shadow-2xl sm:shadow-black/60">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-20 hidden h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black sm:block" />

        {/* Tela */}
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#f6f7fb] sm:rounded-[2.3rem]">
          {/* Barra de status simulada */}
          <div className="relative z-10 hidden h-8 shrink-0 items-center justify-between bg-inherit px-6 pt-1.5 text-[11px] font-semibold text-foreground sm:flex">
            <span>{time}</span>
            <div className="flex items-center gap-1.5">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryMedium className="h-4 w-4" />
            </div>
          </div>

          {children}

          {/* Home indicator */}
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 hidden h-1 w-28 -translate-x-1/2 rounded-full bg-foreground/30 sm:block" />
        </div>
      </div>
    </div>
  );
}
