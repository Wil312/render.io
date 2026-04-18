import { useCallback, useEffect, useRef, useState } from "react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseGenerateReturn {
  messages: Message[];
  streaming: boolean;
  currentCode: string;
  send: (prompt: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

const STORAGE_KEY = "render-io:thread";

/** Extract the last complete ```tsx ... ``` block (requires closing fence). */
function extractCode(text: string): string {
  const matches = [...text.matchAll(/```tsx\s*([\s\S]*?)```/g)];
  if (matches.length === 0) return "";
  return matches[matches.length - 1][1].trim();
}

function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function useGenerate(): UseGenerateReturn {
  // Always initialise to empty so the server and client render identically.
  // localStorage is only available in the browser, so we restore after mount.
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCode, setCurrentCode] = useState<string>("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Restore persisted thread after hydration completes
  useEffect(() => {
    const stored = loadMessages();
    if (stored.length === 0) return;
    setMessages(stored);
    const last = [...stored].reverse().find((m) => m.role === "assistant");
    if (last) {
      const code = extractCode(last.content);
      if (code) setCurrentCode(code);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist thread to localStorage on every update, skipping the initial empty render
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!hydratedRef.current) { hydratedRef.current = true; return; }
    saveMessages(messages);
  }, [messages]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setCurrentCode("");
    setStreaming(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const send = useCallback(
    async (prompt: string) => {
      if (streaming) return;

      const userMessage: Message = { role: "user", content: prompt };

      const nextMessages: Message[] = [
        ...messages,
        userMessage,
        { role: "assistant", content: "" },
      ];
      setMessages(nextMessages);
      setStreaming(true);
      setCurrentCode("");

      const controller = new AbortController();
      abortRef.current = controller;

      const historyForApi: Message[] = [...messages, userMessage];

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyForApi }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          throw new Error((err as { error?: string }).error ?? "Request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") break;

            let parsed: { text?: string; error?: string };
            try {
              parsed = JSON.parse(payload);
            } catch {
              continue;
            }

            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              assistantText += parsed.text;

              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return next;
              });

              setCurrentCode(extractCode(assistantText));
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        setMessages((prev) => {
          const next = [...prev];
          const msg = next[next.length - 1];
          if (msg?.role === "assistant" && msg.content === "") {
            next[next.length - 1] = {
              role: "assistant",
              content: `Error: ${(err as Error).message}`,
            };
          }
          return next;
        });
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming]
  );

  return { messages, streaming, currentCode, send, stop, reset };
}
