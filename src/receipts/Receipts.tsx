import { Hono } from "hono";
import mockReceipts from './data';

const app = new Hono();

app.get("/", (c) => {
    return c.html(`
        <html>
            <head>
                <style>
                    .receipt-card {
                        border: 1px solid #ddd;
                        padding: 15px;
                        margin: 10px;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .items {
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <h1>My Receipts</h1>
                <div class="receipts-container">
                    ${mockReceipts.map(receipt => `
                        <a href="${receipt.id}/">
                            <div class="receipt-card">
                                <h3>${receipt.merchant}</h3>
                                <p>Date: ${receipt.date}</p>
                                <p>Amount: $${receipt.amount.toFixed(2)}</p>
                                <div class="items">
                                    <p>Items:</p>
                                    <ul>
                                        ${receipt.items.map(item => `
                                            <li>${item}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </body>
        </html>
    `)
});


import Receipt from './receipt/Receipt';
app.route("/:id/", Receipt);


export default app;