const Test4 = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">SSE Test (Improved)</h1>
        <div 
          hx-ext="sse" 
          sse-connect="sse" 
          hx-swap="beforeend"
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
import { streamSSE } from 'hono/streaming';
import Page from "./Page";

const app = new Hono();

app.get("/", (c) => {
  return c.html(<Page filename={__filename}><Test4 /></Page>);
});


let id = 0;

// https://hono.dev/docs/helpers/streaming
app.get("/sse", async (c) => {
    return streamSSE(c, async (stream) => {
        while (true) {
            const message = `<div>${id}</div>`
            await stream.writeSSE({
                data: message,
                id: String(id++),
            })
            await stream.sleep(1000)
        }
    })
})

export default app;