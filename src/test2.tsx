const Test2 = () => {
  return (
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-2xl font-bold mb-4">Streaming Test</h1>
        <div id="stream-output" class="mb-4 p-4 bg-gray-50 rounded-lg min-h-[100px]"></div>
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
import { stream } from "hono/streaming";
import Page from "./Page";
import openai from "./lib/openai";
const app = new Hono();

app.get("/", async (c) => {
  return stream(c, async (stream) => {
    stream.onAbort(() => {
      console.log('Stream aborted!');
    });

    const aiStream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Tell me a long story about a fox and a dog" }],
      stream: true,
    });

    for await (const chunk of aiStream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        await stream.write(content);
      }
    }
  }, (err, stream) => {
    console.error('Streaming error:', err);
    stream.write('An error occurred during streaming');
  });
});

export default app; 