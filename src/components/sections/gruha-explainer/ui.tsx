"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { C } from "./tokens";

export interface StageProps {
  reduced: boolean;
  /** Fired once when the stage's guided sequence has finished playing. */
  onSequenceEnd: () => void;
  /** Fired on any user interaction so guided mode can step aside. */
  onInteract: () => void;
}

export function StageCanvas({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 720 440" className="block w-full h-auto select-none" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export function Toolbar({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[#E7E5DE] bg-white/70 px-3 py-2.5 sm:px-4">
      {children}
      {note && <span className="ml-auto text-[11px] leading-tight text-[#858B91]">{note}</span>}
    </div>
  );
}

export function ToolButton({
  children,
  onClick,
  active,
  accent = C.ink,
  primary,
  disabled,
  ...rest
}: React.ComponentProps<"button"> & { active?: boolean; accent?: string; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-[background-color,border-color,color,transform] duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40",
        primary ? "text-white" : "bg-white text-[#17212B] hover:bg-[#F7F6F2]",
      )}
      style={{
        borderColor: primary || active ? accent : "#E1DED5",
        backgroundColor: primary ? accent : active ? `${accent}14` : undefined,
        color: active && !primary ? accent : undefined,
        outlineColor: accent,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
