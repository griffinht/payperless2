import { Hono } from "hono";

const app = new Hono();

const App = () => {
  return (
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 mt-12">Receipt Manager</h1>
      <nav class="space-x-4">
        <a 
          href="/receipts/" 
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          View Receipts
        </a>
        <a 
          href="/recipes/" 
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          View Recipes
        </a>
      </nav>
    </div>
  )
}

import Page from './Page'
app.get('/', (c) => {
  return c.html(
  <Page filename={__filename}>
    <App />
  </Page>)
})

import Receipts from "./receipts/Receipts";
app.route("/receipts/", Receipts);

import Recipes from "./recipes/Recipes";
app.route("/recipes/", Recipes);

import Test from "./test";
app.route("/test/", Test)

import Test2 from "./test2";
app.route("/test2/", Test2)

import Test3 from "./test3";
app.route("/test3/", Test3)

import Test4 from "./test4";
app.route("/test4/", Test4)

import Test5 from "./test5";
app.route("/test5/", Test5)

export default app;