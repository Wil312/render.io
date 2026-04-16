"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import LivePreview from "@/components/LivePreview";

type Tab = "preview" | "code" | "console";
type Viewport = "sm" | "md" | "lg" | "full";

const TABS: { id: Tab; label: string }[] = [
  { id: "preview", label: "Preview" },
  { id: "code",    label: "Code"    },
  { id: "console", label: "Console" },
];

const VIEWPORTS: Viewport[] = ["sm", "md", "lg", "full"];

export default function PreviewPane({ code }: { code: string }) {
  const [tab, setTab] = useState<Tab>("preview");
  const [viewport, setViewport] = useState<Viewport>("full");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab strip */}
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-[var(--line)] bg-[var(--surface)] px-2">
        <div className="flex flex-1 items-center gap-0.5">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`h-7 rounded px-3 text-sm transition-colors ${
                tab === id
                  ? "bg-[var(--surface-2)] font-medium text-[var(--ink)]"
                  : "text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Viewport size toggle */}
        <div className="flex items-center gap-0.5">
          {VIEWPORTS.map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`h-6 rounded px-2 font-mono text-xs transition-colors ${
                viewport === v
                  ? "bg-[var(--surface-3)] font-medium text-[var(--ink-2)]"
                  : "text-[var(--ink-4)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* URL bar */}
      <div className="flex h-8 shrink-0 items-center gap-1 border-b border-[var(--line)] bg-[var(--surface)] px-2">
        <button className="flex h-6 w-6 items-center justify-center rounded text-[var(--ink-4)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-[var(--ink-4)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center rounded text-[var(--ink-4)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]">
          <RotateCcw className="h-3 w-3" />
        </button>
        <div className="flex flex-1 items-center rounded-full bg-[var(--surface-2)] px-3 h-6">
          <span className="font-mono text-xs text-[var(--ink-3)]">localhost:3000 / preview</span>
        </div>
      </div>

      {/* Stage area */}
      <div className="relative flex flex-1 overflow-hidden bg-[var(--surface-2)]">
        {code ? (
          <LivePreview code={code} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="select-none font-mono text-sm text-[var(--ink-4)]">
              // Your component will render here. Describe it on the right →
            </p>
          </div>
        )}
      </div>

      {/* Status footer */}
      <div className="flex h-[26px] shrink-0 items-center gap-3 border-t border-[var(--line)] bg-[var(--surface)] px-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--ok)]" />
          <span className="font-mono text-[11px] text-[var(--ink-4)]">connected</span>
        </div>
        <span className="text-[var(--line-2)]">│</span>
        <span className="font-mono text-[11px] text-[var(--ink-4)]">page.tsx</span>
        <span className="text-[var(--line-2)]">│</span>
        <span className="font-mono text-[11px] text-[var(--ink-4)]">0 lines</span>
        <span className="text-[var(--line-2)]">│</span>
        <span className="font-mono text-[11px] text-[var(--ink-4)]">ready in 0.8s</span>
      </div>
    </div>
  );
}
