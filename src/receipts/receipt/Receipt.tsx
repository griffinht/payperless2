const Receipt = ({receipt}: {receipt: any}) => {
    return (
      <div class="max-w-2xl mx-auto px-4 py-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-blue-600 px-6 py-4">
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold text-white">Receipt #{receipt.id}</h1>
                    <span class="text-xl font-bold text-white">{receipt.amount.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="p-6">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p class="text-sm text-gray-600">Date</p>
                        <p class="text-lg font-medium">{receipt.date}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Merchant</p>
                        <p class="text-lg font-medium">{receipt.merchant}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-800 mb-3">Items</h2>
                    <ul class="space-y-2">
                        {receipt.items.map((item: any) => (
                            <li class="flex items-center">
                                <span class="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                <span class="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div class="flex gap-4 mt-8">
                    <a href=".." 
                        class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors duration-200">
                        ← Back to Receipts
                    </a>
                    <form action="recipes/" method="post" class="flex-1">
                        <button type="submit"
                            class="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg text-center hover:bg-green-700 transition-colors duration-200">
                            Generate Recipes
                        </button>
                    </form>
                    <a href="share/" 
                        class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg text-center hover:bg-blue-700 transition-colors duration-200">
                        Share Receipt
                    </a>
                </div>
            </div>
        </div>
    </div>
    )
}

import { Hono } from "hono";
import mockReceipts from "../data";
import Page from "../../Page";
const app = new Hono();

app.get("/", (c) => {
    const idParam = c.req.param("receipt");
    if (!idParam) {
        throw new Error("Invalid Receipt ID");
    }
    
    const id = parseInt(idParam);
    const receipt = mockReceipts.find(r => r.id === id);

    if (!receipt) {
       throw new Error("Receipt not found");
    }

    return c.html(<Page><Receipt receipt={receipt} /></Page>);
});


import Share from './share/Share';
app.route("/share/", Share);

import Recipes from './recipes/Recipes';
app.route("/recipes/", Recipes);

export default app;