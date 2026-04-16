import { Play, Square, Share2 } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex h-11 shrink-0 items-center border-b border-[var(--line)] bg-[var(--surface)] px-3">
      {/* Left: logo + breadcrumb */}
      <div className="flex flex-1 items-center gap-2 min-w-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[var(--accent)] select-none">
          <span className="text-sm font-bold leading-none text-white">R</span>
        </div>
        <span className="text-sm text-[var(--ink-3)] truncate">
          <span className="text-[var(--ink-2)]">user</span>
          <span className="mx-1 text-[var(--ink-4)]">/</span>
          <span className="text-[var(--ink-2)]">untitled-project</span>
          <span className="mx-2 text-[var(--ink-4)]">·</span>
          <span className="text-[var(--ink-4)]">saved</span>
        </span>
      </div>

      {/* Center: run controls */}
      <div className="flex shrink-0 items-center gap-1.5">
        <button className="flex h-7 items-center gap-1.5 rounded-md bg-[var(--ok)] px-3 text-sm font-medium text-white transition-opacity hover:opacity-90">
          <Play className="h-3 w-3 fill-white stroke-none" />
          Run
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]">
          <Square className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right: share / deploy / avatar */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <button className="flex h-7 items-center gap-1.5 rounded-md border border-[var(--line)] px-3 text-sm font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)]">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
        <button className="flex h-7 items-center gap-1.5 rounded-md bg-[var(--ink)] px-3 text-sm font-medium text-white transition-opacity hover:opacity-80">
          Deploy
        </button>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-2)] text-xs font-semibold text-[var(--accent)] select-none">
          W
        </div>
      </div>
    </header>
  );
}
