import { useCallback, useRef, useState } from "react";

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
}

/** Extract the last ```tsx ... ``` block from a string. */
function extractCode(text: string): string {
  const matches = [...text.matchAll(/```tsx\s*([\s\S]*?)(?:```|$)/g)];
  if (matches.length === 0) return "";
  const last = matches[matches.length - 1];
  return last[1].trim();
}

export function useGenerate(): UseGenerateReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const send = useCallback(async (prompt: string) => {
    if (streaming) return;

    const userMessage: Message = { role: "user", content: prompt };

    // Optimistically append user message and a blank assistant placeholder
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

    // The history sent to the API is everything except the blank assistant placeholder
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
        // Keep any incomplete last line in the buffer
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

            // Update the assistant message in place
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", content: assistantText };
              return next;
            });

            setCurrentCode(extractCode(assistantText));
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // User stopped the stream — keep whatever text arrived so far
        return;
      }

      // Replace blank assistant placeholder with an error message
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
  }, [messages, streaming]);

  return { messages, streaming, currentCode, send, stop };
}
