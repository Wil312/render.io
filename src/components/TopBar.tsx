"use client";

import { Play, Square, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TopBar() {
  function handleShare() {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    toast.success("Link copied to clipboard");
  }

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className="border-[var(--line)] text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]"
            >
              <Square className="!size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Stop</TooltipContent>
        </Tooltip>
      </div>

      {/* Right: share / deploy / avatar */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
        >
          <Share2 className="!size-3.5" />
          Share
        </Button>
        <Button
          size="sm"
          className="bg-[var(--ink)] text-white hover:bg-[var(--ink-2)] hover:text-white"
        >
          Deploy
        </Button>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-2)] text-xs font-semibold text-[var(--accent)] select-none">
          W
        </div>
      </div>
    </header>
  );
}
