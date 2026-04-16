"use client";

import { useState } from "react";
import { Image as ImageIcon, Paperclip, AtSign, Plus } from "lucide-react";
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

const CHIPS = [
  "+ add dark mode",
  "+ mobile layout",
  "+ animate on scroll",
  "+ extract to hook",
];

export default function PromptPane() {
  const [value, setValue] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);

  function handleGenerate() {
    if (!value.trim()) return;
    // Generation logic wired in later
    toast.info("Generating component…");
  }

  function handleNewChat() {
    setValue("");
    setNewChatOpen(false);
    toast.success("New chat started");
  }

  return (
    <div className="flex w-[420px] shrink-0 flex-col bg-[var(--surface)]">
      {/* Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[var(--line)] px-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--ink-2)]">AI Assistant</span>
          {/* New chat dialog */}
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

      {/* Thread (empty — messages render here) */}
      <div className="flex-1 overflow-y-auto" />

      {/* Composer */}
      <div className="shrink-0 border-t border-[var(--line)] p-3">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] transition-colors focus-within:border-[var(--line-2)]">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.metaKey) handleGenerate();
            }}
            placeholder="Describe a component…"
            rows={3}
            className="min-h-0 resize-none rounded-b-none rounded-t-xl border-0 bg-transparent px-3 pt-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:ring-0 focus-visible:border-0"
          />
          <div className="flex items-center justify-between px-2 pb-2 pt-1">
            <div className="flex items-center gap-0.5">
              {[
                { icon: ImageIcon, label: "Attach image" },
                { icon: Paperclip, label: "Attach file" },
                { icon: AtSign,    label: "Mention" },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-[var(--ink-4)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-3)]"
                    >
                      <Icon className="!size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">{label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleGenerate}
              className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 hover:text-white"
            >
              Generate
              <kbd className="ml-1 font-mono text-[10px] opacity-70">⌘↵</kbd>
            </Button>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setValue((v) => (v ? `${v}\n${chip.slice(2)}` : chip.slice(2)))}
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
