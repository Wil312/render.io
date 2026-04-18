"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGenerate } from "@/lib/useGenerate";
import TopBar from "@/components/TopBar";
import Rail from "@/components/Rail";
import PreviewPane from "@/components/PreviewPane";
import PromptPane from "@/components/PromptPane";

const PROMPT_WIDTH_KEY = "render-io:prompt-width";
const MIN_WIDTH = 340;
const MAX_WIDTH = 640;
const DEFAULT_WIDTH = 420;

function loadWidth(): number {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  const stored = parseInt(localStorage.getItem(PROMPT_WIDTH_KEY) ?? "", 10);
  return isNaN(stored) ? DEFAULT_WIDTH : Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, stored));
}

export default function Home() {
  const { messages, streaming, currentCode, send, stop, reset } = useGenerate();

  // Always start at DEFAULT_WIDTH so server and client render identically.
  // Restore the persisted width after hydration.
  const [promptWidth, setPromptWidth] = useState<number>(DEFAULT_WIDTH);

  useEffect(() => {
    setPromptWidth(loadWidth());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist width whenever it changes (skip the initial default-value render)
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    try {
      localStorage.setItem(PROMPT_WIDTH_KEY, String(promptWidth));
    } catch {
      // ignore
    }
  }, [promptWidth]);

  // Drag state — all in refs so we don't trigger re-renders mid-drag
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = promptWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [promptWidth]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      // Dragging left = wider prompt pane; dragging right = narrower
      const delta = dragStartX.current - e.clientX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragStartWidth.current + delta));
      setPromptWidth(next);
    }

    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // stable — uses only refs

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg)]">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Rail />
        <PreviewPane code={currentCode} />

        {/* Draggable 1px divider */}
        <div
          onMouseDown={handleDividerMouseDown}
          className="group relative w-px shrink-0 cursor-col-resize bg-[var(--line)] transition-colors hover:bg-[var(--accent)]"
        >
          {/* Extended hit area */}
          <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
        </div>

        {/* Prompt pane — width controlled here, PromptPane fills w-full */}
        <div
          style={{ width: promptWidth, minWidth: MIN_WIDTH, maxWidth: MAX_WIDTH }}
          className="shrink-0 overflow-hidden"
        >
          <PromptPane
            messages={messages}
            streaming={streaming}
            send={send}
            stop={stop}
            reset={reset}
          />
        </div>
      </div>
    </div>
  );
}
