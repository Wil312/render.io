"use client";

import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Paperclip,
  AtSign,
  Plus,
  Loader2,
  Check,
  X,
  Square,
  FileCode2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { Message } from "@/lib/useGenerate";

interface Props {
  messages: Message[];
  streaming: boolean;
  send: (prompt: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

const CHIPS = [
  "+ add dark mode",
  "+ mobile layout",
  "+ animate on scroll",
  "+ extract to hook",
];

// ── toolcard variants ────────────────────────────────────────────────────────

function ToolCard({
  isStreaming,
  isError,
}: {
  isStreaming: boolean;
  isError: boolean;
}) {
  if (isError) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5">
        <X className="h-3.5 w-3.5 text-red-500" />
        <span className="font-mono text-xs text-red-600">Error generating component</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5">
      {isStreaming ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent)]" />
      ) : (
        <Check className="h-3.5 w-3.5 text-[var(--ok)]" />
      )}
      <FileCode2 className="h-3.5 w-3.5 text-[var(--ink-3)]" />
      <span className="font-mono text-xs text-[var(--ink-2)]">
        {isStreaming ? "Editing" : "Edited"} App.tsx
      </span>
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────

export default function PromptPane({ messages, streaming, send, stop, reset }: Props) {
  const [value, setValue] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleGenerate() {
    const prompt = value.trim();
    if (!prompt || streaming) return;
    setValue("");
    await send(prompt);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  }

  function handleNewChat() {
    setValue("");
    reset();
    setNewChatOpen(false);
    toast.success("New chat started");
  }

  return (
    <div className="flex w-full flex-col bg-[var(--surface)]">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--line)] px-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-[var(--ink-2)]">AI Assistant</span>

          <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-[var(--ink-4)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]"
                  >
                    <Plus className="!size-3.5" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">New chat</TooltipContent>
            </Tooltip>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start a new chat?</DialogTitle>
                <DialogDescription>
                  This will clear the current thread. Any unsaved progress will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleNewChat}
                  className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 hover:text-white"
                >
                  Start new chat
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--ink-3)]">
          claude-sonnet-4-6
        </span>
      </div>

      {/* ── Thread ─────────────────────────────────────────────────────────── */}
      <div
        ref={threadRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto py-3"
      >
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center px-6 text-center">
            <p className="font-mono text-xs text-[var(--ink-4)]">
              Describe a component and hit Generate.
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end px-3">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[var(--surface-3)] px-3.5 py-2 text-sm text-[var(--ink)]">
                  {msg.content}
                </div>
              </div>
            );
          }

          // Assistant bubble — rendered as a Replit-style toolcard
          const isLastMsg = i === messages.length - 1;
          const isCurrentlyStreaming = streaming && isLastMsg;
          const isError = msg.content.startsWith("Error:");

          return (
            <div key={i} className="px-3">
              <ToolCard isStreaming={isCurrentlyStreaming} isError={isError} />
            </div>
          );
        })}
      </div>

      {/* ── Composer ───────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-[var(--line)] p-3">
        <div
          className={`rounded-xl border bg-[var(--surface)] transition-colors focus-within:border-[var(--line-2)] ${
            streaming ? "border-[var(--line)] opacity-60" : "border-[var(--line)]"
          }`}
        >
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a component…"
            rows={3}
            disabled={streaming}
            className="min-h-0 resize-none rounded-b-none rounded-t-xl border-0 bg-transparent px-3 pt-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:ring-0 focus-visible:border-0 disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            {/* Left: attach buttons */}
            <div className="flex items-center gap-0.5">
              {[
                { icon: ImageIcon, label: "Attach image" },
                { icon: Paperclip, label: "Attach file" },
                { icon: AtSign,    label: "Mention"       },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={streaming}
                      className="text-[var(--ink-4)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]"
                    >
                      <Icon className="!size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Right: Generate or Stop */}
            {streaming ? (
              <Button
                size="sm"
                variant="outline"
                onClick={stop}
                className="border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--surface-2)]"
              >
                <Square className="!size-3" />
                Stop
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={!value.trim()}
                className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                Generate
                <kbd className="ml-1 font-mono text-[10px] opacity-70">⌘↵</kbd>
              </Button>
            )}
          </div>
        </div>

        {/* Suggestion chips */}
        {!streaming && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() =>
                  setValue((v) => (v ? `${v}\n${chip.slice(2)}` : chip.slice(2)))
                }
                className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--ink-3)] transition-colors hover:border-[var(--line-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
