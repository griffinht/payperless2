const Item = ({ name, price }: { name: string, price: number }) => {
    return (
        <li class="text-sm text-gray-600">{name} {price}</li>
    )
}

const ReceiptPreview = ({ receipt }: { receipt: any }) => {
    return (
        <a href={`${receipt.id}/`} class="block transform hover:scale-105 transition-transform duration-200">
            <div class="bg-white rounded-lg shadow-md hover:shadow-xl p-6 transition-shadow duration-200">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-semibold text-gray-800">{receipt.merchant}</h3>
                    <span class="text-lg font-bold text-green-600">{receipt.amount.toFixed(2)}</span>
                </div>
                <p class="text-gray-600 mb-4">{receipt.date}</p>
                <div class="border-t pt-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Items:</p>
                    <ul class="space-y-1">
                        {receipt.items.map((item: any) => <Item name={item.name} price={item.price} />)}
                    </ul>
                </div>
            </div>
        </a>
    )
}

const Receipts = ({receipts}: { receipts: any[] }) => {
    return (
        <div class="max-w-6xl mx-auto px-4">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">My Receipts</h1>
                <a href="..//" class="text-blue-600 hover:text-blue-800 font-medium">← Back to Home</a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {receipts.map(receipt => <ReceiptPreview receipt={receipt} />)}
            </div>
        </div>
    )
}


import Page from "../Page";
import mockReceipts from './data';
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.html(
    <Page>
        <Receipts receipts={mockReceipts} />
    </Page>)
});


import Receipt from './receipt/Receipt';
app.route("/:receipt/", Receipt);


export default app;