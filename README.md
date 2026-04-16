# render.io

**Describe a component, watch it render.**

> _Screenshot coming soon_

render.io is an AI-powered React component playground. Type a description into the prompt pane, hit **Generate**, and Claude streams a self-contained TSX component directly into a live Sandpack preview — no build step, no file uploads, no copying and pasting.

---

## How it works

```
User prompt
    │
    ▼
POST /api/generate          (Next.js Route Handler, Node.js runtime)
    │  Streams SSE text deltas from claude-sonnet-4-5
    ▼
useGenerate hook            (client-side)
    │  Accumulates stream into assistant message
    │  Extracts first complete ```tsx block once the closing fence arrives
    ▼
LivePreview                 (Sandpack, react-ts template)
    │  Debounces file updates 400 ms
    │  Injects Tailwind Play CDN via externalResources
    │  Shows loading shimmer while bundling; compact error bar on compile errors
    ▼
Preview iframe
```

Conversations persist to `localStorage` so your thread survives a page refresh. The prompt pane is resizable (drag the divider). Copy or download the generated code with one click.

---

## Setup

```bash
git clone https://github.com/Wil312/render.io.git
cd render.io
npm install
cp .env.local.example .env.local
# paste your Anthropic API key into .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key. Get one at [console.anthropic.com](https://console.anthropic.com). |

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWil312%2Frender.io&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key&envLink=https%3A%2F%2Fconsole.anthropic.com)

1. Click the button above (or import the repo manually at [vercel.com/new](https://vercel.com/new))
2. Add `ANTHROPIC_API_KEY` in the **Environment Variables** step
3. Deploy — Vercel auto-detects Next.js; no `vercel.json` required

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) — App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) (neutral theme) |
| AI | [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — `claude-sonnet-4-5` |
| Live preview | [Sandpack](https://sandpack.codesandbox.io/) (`react-ts` template + Tailwind Play CDN) |
| Icons | [Lucide React](https://lucide.dev/) |
| Validation | [Zod](https://zod.dev/) |
| Toasts | [Sonner](https://sonner.emilkowal.ski/) |

---

## License

MIT — see [LICENSE](./LICENSE).
