import { Signal, Wifi, BatteryMedium } from "lucide-react";
import type { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
}

/**
 * Moldura reutilizável de smartphone virtual (bezel, notch, status bar e home indicator).
 */
export function PhoneFrame({ children, className, screenClassName }: PhoneFrameProps) {
  return (
    <div
      className={`relative h-[680px] max-h-[84vh] w-[340px] max-w-full shrink-0 rounded-[2.8rem] border-[6px] border-black bg-black shadow-2xl shadow-black/60 ${className ?? ""}`}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black" />

      {/* Screen */}
      <div
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[2.3rem] bg-background ${screenClassName ?? ""}`}
      >
        {/* Status bar */}
        <div className="relative z-10 flex h-8 shrink-0 items-center justify-between bg-inherit px-6 pt-1.5 text-[11px] font-semibold text-foreground">
          <span>14:47</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryMedium className="h-4 w-4" />
          </div>
        </div>

        {children}

        {/* Home indicator */}
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-foreground/30" />
      </div>
    </div>
  );
}
