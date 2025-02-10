const Response = ({ prompt }: { prompt: string }) => {
  return (
    <p 
      hx-ext="sse" 
      sse-connect={"response?prompt=" + prompt} 
      hx-swap="beforeend"
      sse-swap="message"
      sse-close="close"
      class="mb-4 p-4 bg-gray-50 rounded-lg min-h-[100px]">
      Waiting for messages...
    </p>
  )
}

const Request = () => {
  return (
    <form hx-post="request" hx-swap="afterend" class="mb-4">
      <div class="relative">
        <input 
          type="text" 
          name="prompt" 
          placeholder="Enter your prompt..."
          class="w-full p-2 border rounded-lg"
        />
      </div>
      <button 
        type="submit" 
        class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 relative"
      >
        Send
        <div class="htmx-indicator absolute right-2 top-1/2 -translate-y-1/2">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white">loading</div>
        </div>
      </button>
    </form>
  )
}

const Test4 = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">SSE Test (Improved)</h1>
        <Request />
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


// https://hono.dev/docs/helpers/streaming
app.get("/response", async (c) => {
  const prompt = c.req.query('prompt') || 'the user didnt say anything - why dont you let them know';
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      stream: true
    })
  });


  return streamSSE(c, async (stream) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let id = 0;

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.includes('[DONE]')) continue;
        if (!line.startsWith('data: ')) continue;

        const json = JSON.parse(line.slice(6));
        if (!json.choices[0].delta.content) continue;

        // todo raw string templating yikes!
        await stream.writeSSE({
          data: `${json.choices[0].delta.content}`,
          event: 'message',
          id: String(id++)
        });
      }
    }

    await stream.writeSSE({
      data: await Bun.readableStreamToText((await c.render(<Request />)).body as any),
      event: 'message',
      id: String(id++)
    })

    await stream.writeSSE({
      data: '',
      event: 'close',
      id: String(id++)
    })
  });
});

app.post("/request", async (c) => {
  const { prompt } = await c.req.parseBody();

  return c.html(<Response prompt={prompt as string} />);
});

export default app;