"use client";

import { useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";

// ── static sandbox boilerplate ──────────────────────────────────────────────

const INDEX_TSX = `\
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

// Shown before the first prompt is submitted
const PLACEHOLDER_APP = `\
export default function App() {
  return null;
}
`;

// ── inner component (must live inside SandpackProvider) ─────────────────────

function SandpackInner({ code }: { code: string }) {
  const { sandpack } = useSandpack();
  const sandpackRef = useRef(sandpack);
  sandpackRef.current = sandpack;

  const codeRef = useRef(code);
  codeRef.current = code;

  // Debounce Sandpack file updates 400 ms so partial streaming code
  // doesn't thrash the bundler on every keystroke / delta.
  useEffect(() => {
    const t = setTimeout(() => {
      sandpackRef.current.updateFile(
        "/App.tsx",
        codeRef.current || PLACEHOLDER_APP
      );
    }, 400);
    return () => clearTimeout(t);
  }, [code]);

  const isRunning = sandpack.status === "running";
  const error = sandpack.error;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SandpackPreview
        showNavigator={false}
        showOpenInCodeSandbox={false}
        style={{ height: "100%", width: "100%" }}
      />

      {/* Loading shimmer — visible while the bundler is compiling */}
      {isRunning && (
        <div className="pointer-events-none absolute inset-0 z-10 animate-pulse bg-[var(--surface-2)]" />
      )}

      {/* Compact error bar — replaces Sandpack's full-screen error overlay */}
      {error && (
        <div className="absolute inset-x-0 bottom-0 z-20 max-h-28 overflow-auto border-t border-red-200 bg-red-50 px-3 py-2">
          <p className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-red-600">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}

// ── public component ─────────────────────────────────────────────────────────

export default function LivePreview({ code }: { code: string }) {
  return (
    <div className="h-full w-full">
      <SandpackProvider
        template="react-ts"
        files={{
          "/App.tsx": { code: code || PLACEHOLDER_APP },
          "/index.tsx": { code: INDEX_TSX, hidden: true },
        }}
        customSetup={{
          dependencies: {
            "lucide-react": "latest",
          },
        }}
        options={{
          // Injects Tailwind Play CDN into the preview iframe
          externalResources: ["https://cdn.tailwindcss.com"],
        }}
        style={{ height: "100%" }}
      >
        <SandpackInner code={code} />
      </SandpackProvider>
    </div>
  );
}
