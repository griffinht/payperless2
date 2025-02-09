import { Hono } from "hono";

const app = new Hono();

app.get('/', (c) => {
  return c.html(`
    <html>
      <body>
        <h1>Receipt Manager</h1>
        <nav>
          <a href="/receipts/">View Receipts</a>
        </nav>
      </body>
    </html>
  `)
})

import Receipts from "./receipts/Receipts";
app.route("/receipts/", Receipts);

export default app;