import { Hono } from "hono";
import mockReceipts from "../../data";
import type { FC } from 'hono/jsx'
import Page from "../../../Page";
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
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-blue-600 px-6 py-4">
          <h1 class="text-2xl font-bold text-white">Share Receipt #{props.id}</h1>
        </div>
        
        <div class="p-6">
          <p class="text-lg text-gray-700 mb-6">Share this receipt from {props.merchant}</p>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Date</p>
                <p class="text-lg font-medium">{props.date}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Amount</p>
                <p class="text-lg font-medium">${props.amount.toFixed(2)}</p>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-600">Items</p>
              <p class="text-gray-700">{props.items.join(', ')}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <p class="text-sm font-medium text-gray-700 mb-2">Share URL</p>
            <input 
              type="text" 
              readonly 
              value={shareUrl} 
              onclick="this.select()" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>
          
          <div class="flex gap-4">
            <a 
              href={`mailto:?subject=Receipt from ${props.merchant}&body=View receipt details at: ${shareUrl}`}
              class="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg text-center hover:bg-green-700 transition-colors duration-200"
            >
              Share via Email
            </a>
            <a 
              href=".."
              class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors duration-200"
            >
              Back to Receipt
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

app.get("/", (c) => {
  const idParam = c.req.param("id");
  const InvalidReceiptId = () => {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-red-600 mb-4">Invalid Receipt ID</h1>
          <a href="../" class="text-blue-600 hover:text-blue-800 font-medium">← Back to Receipts</a>
        </div>
      </div>
    )
  }
  
  if (!idParam) {
    return c.html(<InvalidReceiptId />);
  }

  const id = parseInt(idParam);
  const receipt = mockReceipts.find(r => r.id === id);

  const NotFound = () => {
    return (
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-red-600 mb-4">Receipt not found</h1>
          <a href="../" class="text-blue-600 hover:text-blue-800 font-medium">← Back to Receipts</a>
        </div>
      </div>
    )
  }

  return c.html(
  <Page filename={__filename}>
    {receipt ? <ShareView {...receipt} /> : <NotFound />}
  </Page>);
});

export default app; 