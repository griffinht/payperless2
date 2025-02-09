import { Hono } from "hono";
import mockReceipts from "../data";
import type { FC } from 'hono/jsx'

const app = new Hono();

app.get("/", (c) => {
    const id = parseInt(c.req.param("id"));
    const receipt = mockReceipts.find(r => r.id === id);

    if (!receipt) {
        return c.html(`
            <html>
                <body>
                    <h1>Receipt not found</h1>
                </body>
            </html>
        `);
    }

    return c.html(`
        <html>
            <body>
                <h1>Receipt #${receipt.id}</h1>
                <div>
                    <p><strong>Date:</strong> ${receipt.date}</p>
                    <p><strong>Merchant:</strong> ${receipt.merchant}</p>
                    <p><strong>Amount:</strong> $${receipt.amount.toFixed(2)}</p>
                    <h2>Items:</h2>
                    <ul>
                        ${receipt.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    <a href="../" class="back-button">Back to Receipts</a>
                    <a href="share" class="share-button">Share Receipt</a>
                </div>
            </body>
        </html>
    `);
});

interface ReceiptProps {
  id: number
  date: string
  merchant: string
  amount: number
  items: string[]
}

export const ReceiptComponent: FC<ReceiptProps> = (props) => {
  return (
    <div class="receipt-container">
      <h1>Receipt #{props.id}</h1>
      <div class="receipt-details">
        <p><strong>Date:</strong> {props.date}</p>
        <p><strong>Merchant:</strong> {props.merchant}</p>
        <p><strong>Amount:</strong> ${props.amount.toFixed(2)}</p>
        <h2>Items:</h2>
        <ul>
          {props.items.map(item => (
            <li>{item}</li>
          ))}
        </ul>
        <div class="button-container">
          <a href="share" class="share-button">Shae Receipt</a>
          <a href="../" class="back-button">Back to Receipts</a>
        </div>
      </div>
      <style>{`
        .receipt-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .receipt-details {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
        }
        .button-container {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .share-button, .back-button {
          display: inline-block;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          color: white;
        }
        .share-button {
          background-color: #007bff;
        }
        .share-button:hover {
          background-color: #0056b3;
        }
        .back-button {
          background-color: #6c757d;
        }
        .back-button:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  )
}


import Share from './Share';
app.route("/share", Share);


export default app;