const Test3 = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">SSE Test</h1>
        <div 
          hx-ext="sse" 
          sse-connect="/test/" 
          sse-swap="message"
          class="mb-4 p-4 bg-gray-50 rounded-lg min-h-[100px]">
          Waiting for messages...
        </div>
        <div class="mt-8">
          <a href=".." 
            class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors duration-200">
            ← Back
          </a>
        </div>
      </div>
    </div>
  )
}

import { Hono } from "hono";
import Page from "./Page";

const app = new Hono();

app.get("/", (c) => {
  return c.html(<Page filename={__filename}><Test3 /></Page>);
});

app.get("/api/sse", async (c) => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');

  const stream = new ReadableStream({
    async start(controller) {
      let count = 0;
      
      const interval = setInterval(() => {
        // Send HTML content that will be swapped into the page
        const htmlContent = `<div class="p-2 border-b border-gray-200">
          Message ${count}: ${new Date().toLocaleTimeString()}
        </div>`;
        
        // Format as event: message\ndata: htmlContent
        const message = `event: message\ndata: ${htmlContent}\n\n`;
        controller.enqueue(message);
        count++;
        
        if (count > 10) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);

      c.req.raw.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
        console.log('SSE connection closed');
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  });
});

export default app; 