import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export const runtime = "nodejs";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1),
});

const SYSTEM_PROMPT = `You are a React component generator. When given a description, respond with a single self-contained React functional component as a default export written in TSX.

Rules:
- The component must work in Sandpack's "react-ts" template (React 18, TypeScript).
- You may use Tailwind CSS utility classes for styling.
- Only import from "react" and "lucide-react" — no other external packages.
- Do not include any import statements for CSS files.
- Do not use next/image, next/link, or any Next.js-specific APIs.
- Export the component as the default export.
- Always wrap the entire code block in a \`\`\`tsx fenced code block.
- Do not include any explanation outside the code block — just the fenced block.

Example format:
\`\`\`tsx
import { useState } from "react";

export default function MyComponent() {
  return <div className="p-4">Hello</div>;
}
\`\`\``;

export async function POST(req: NextRequest) {
  // Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { messages } = parsed.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  // Build a ReadableStream that pipes SSE text deltas to the client
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function send(data: string) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: data })}\n\n`));
      }

      try {
        const anthropicStream = client.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send(event.delta.text);
          }
        }

        // Signal completion
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
