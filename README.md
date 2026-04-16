# render.io

Describe a component, watch it render.

## Setup

```bash
git clone <repo-url>
cd render.io
npm install
cp .env.local.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stack

- [Next.js 15](https://nextjs.org/) — App Router, React Server Components
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) — component library (neutral theme)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — Claude API
- [Sandpack](https://sandpack.codesandbox.io/) — in-browser code preview
- [Lucide React](https://lucide.dev/) — icons
- [Zod](https://zod.dev/) — schema validation
