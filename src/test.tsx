const Recipes = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">Hello World</h1>
        <div class="mt-8">
          <a href=".." 
            class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors duration-200">
            ← Back to Receipt
          </a>
        </div>
      </div>
    </div>
  )
}

import { Hono } from "hono";
import Page from "./Page";
import openai from "./lib/openai";
const app = new Hono();

async function stream(c: any) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Tell me a long story about a fox and a dog" }],
    stream: true,
  });

  // Set up streaming response headers
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          controller.enqueue(encoder.encode(`${content}`));
        }
      }
      controller.enqueue(encoder.encode('data: <div>hi</div>\n\n'));
      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

app.get("/", async (c) => {
  return stream(c);
});

export default app;