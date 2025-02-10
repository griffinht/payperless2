const RecipeCard = ({ title, ingredients }: { 
    title: string, 
    ingredients: string[]
}) => {
    return (
        <a href={`recipe/${encodeURIComponent(title)}`} class="block">
            <div class="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
                <h2 class="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <div class="mb-4">
                    <h3 class="font-semibold text-gray-700 mb-2">Main Ingredients:</h3>
                    <ul class="list-disc list-inside space-y-1">
                        {ingredients.slice(0, 3).map((ingredient) => (
                            <li class="text-gray-600">{ingredient}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </a>
    );
};

const Recipes = ({ receipt }: { receipt: any }) => {
    const recipeCards = [
        {
            title: "Quick Pasta Dish",
            ingredients: [
                "Pasta from your receipt",
                "Olive oil",
                "Garlic",
                "Salt and pepper"
            ],
            instructions: [
                "Boil pasta according to package instructions",
                "Heat olive oil in a pan and add minced garlic",
                "Combine and season to taste"
            ]
        },
        {
            title: "Simple Salad",
            ingredients: [
                "Fresh vegetables from your receipt",
                "Olive oil",
                "Balsamic vinegar",
                "Salt and pepper"
            ],
            instructions: [
                "Wash and chop all vegetables",
                "Combine in a large bowl",
                "Dress with olive oil and vinegar",
                "Season to taste"
            ]
        }
    ];

    return (
        <div class="max-w-2xl mx-auto px-4 py-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Recipe Cards</h1>
            <p class="text-gray-600 mb-6">Click a card to view the full recipe</p>
            
            <div class="space-y-6">
                {recipeCards.map((recipe) => (
                    <RecipeCard title={recipe.title} ingredients={recipe.ingredients} />
                ))}
            </div>

            <div class="mt-8">
                <a href="." 
                    class="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors duration-200">
                    ← Back to Receipt
                </a>
            </div>
        </div>
    );
};

import { Hono } from "hono";
import Page from "../../../Page";
import mockReceipts from "../../data";
const app = new Hono();

app.get("/", (c) => {
    const idParam = c.req.param("id");
    if (!idParam) {
        throw new Error("Invalid Receipt ID");
    }
    
    const id = parseInt(idParam);
    const receipt = mockReceipts.find(r => r.id === id);

    if (!receipt) {
       throw new Error("Receipt not found");
    }

    return c.html(<Page><Recipes receipt={receipt} /></Page>);
});

import Recipe from './Recipe'
app.route('/recipe/', Recipe)

export default app; 