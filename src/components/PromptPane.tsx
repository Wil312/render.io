"use client";

import { useState } from "react";
import { Image as ImageIcon, Paperclip, AtSign } from "lucide-react";

const CHIPS = [
  "+ add dark mode",
  "+ mobile layout",
  "+ animate on scroll",
  "+ extract to hook",
];

export default function PromptPane() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-[420px] shrink-0 flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--line)] px-3">
        <span className="text-sm font-medium text-[var(--ink-2)]">AI Assistant</span>
        <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--ink-3)]">
          claude-sonnet-4-6
        </span>
      </div>

      {/* Thread (empty — messages go here) */}
      <div className="flex-1 overflow-y-auto" />

      {/* Composer */}
      <div className="shrink-0 border-t border-[var(--line)] p-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] transition-colors focus-within:border-[var(--line-2)]">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe a component…"
            rows={3}
            className="w-full resize-none rounded-t-xl bg-transparent px-3 pt-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none"
          />
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <div className="flex items-center gap-0.5">
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--ink-4)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]">
                <ImageIcon className="h-4 w-4" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--ink-4)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--ink-4)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]">
                <AtSign className="h-4 w-4" />
              </button>
            </div>
            <button className="flex h-7 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Generate
              <kbd className="font-mono text-[10px] opacity-70">⌘↵</kbd>
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-3)] transition-colors hover:border-[var(--line-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
