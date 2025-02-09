import { Hono } from "hono";
import mockReceipts from "../data";
import type { FC } from 'hono/jsx'

const app = new Hono();

interface ShareViewProps {
  id: number
  date: string
  merchant: string
  amount: number
  items: string[]
}

const ShareView: FC<ShareViewProps> = (props) => {
  const shareUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/receipts/${props.id}/`;
  
  return (
    <div class="share-container">
      <h1>Share Receipt #{props.id}</h1>
      <div class="share-details">
        <p>Share this receipt from {props.merchant}</p>
        <div class="receipt-preview">
          <p><strong>Date:</strong> {props.date}</p>
          <p><strong>Amount:</strong> ${props.amount.toFixed(2)}</p>
          <p><strong>Items:</strong> {props.items.join(', ')}</p>
        </div>
        <div class="share-url">
          <p>Share URL:</p>
          <input type="text" readonly value={shareUrl} onclick="this.select()" />
        </div>
        <div class="share-buttons">
          <a href={`mailto:?subject=Receipt from ${props.merchant}&body=View receipt details at: ${shareUrl}`} class="share-button email">
            Share via Email
          </a>
          <a href="." class="share-button back">
            Back to Receipt
          </a>
        </div>
      </div>
      <style>{`
        .share-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .share-details {
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
        }
        .receipt-preview {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .share-url input {
          width: 100%;
          padding: 8px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .share-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .share-button {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          color: white;
          text-align: center;
          flex: 1;
        }
        .email {
          background-color: #28a745;
        }
        .email:hover {
          background-color: #218838;
        }
        .back {
          background-color: #6c757d;
        }
        .back:hover {
          background-color: #5a6268;
        }
      `}</style>
    </div>
  )
}

app.get("/", (c) => {
  const id = parseInt(c.req.param("id"));
  const receipt = mockReceipts.find(r => r.id === id);

  if (!receipt) {
    return c.html(
      <html>
        <body>
          <h1>Receipt not found</h1>
        </body>
      </html>
    );
  }

  return c.html(
    <html>
      <body>
        <ShareView {...receipt} />
      </body>
    </html>
  );
});

export default app; 