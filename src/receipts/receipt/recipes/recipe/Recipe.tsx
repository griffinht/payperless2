const Recipe = ({ recipe }: { recipe: any }) => {
    return (
        <div class="max-w-2xl mx-auto px-4 py-8">
            <div class="bg-white rounded-xl shadow-lg p-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">{recipe.title}</h1>
                
                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-700 mb-4">Ingredients</h2>
                    <ul class="list-disc list-inside space-y-2">
                        {recipe.ingredients.map((ingredient: string) => (
                            <li class="text-gray-600">{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div class="mb-8">
                    <h2 class="text-xl font-semibold text-gray-700 mb-4">Instructions</h2>
                    <ol class="list-decimal list-inside space-y-4">
                        {recipe.instructions.map((step: string) => (
                            <li class="text-gray-600">{step}</li>
                        ))}
                    </ol>
                </div>

                <div class="mt-8">
                    <a href=".." 
                        class="inline-block px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg text-center hover:bg-gray-200 transition-colors duration-200">
                        ← Back to Recipe Cards
                    </a>
                </div>
            </div>
        </div>
    );
};

import { Hono } from "hono";
import Page from "../../../../Page";
const app = new Hono();

app.get("/", (c) => {
    const title = decodeURIComponent(c.req.param("recipe"));
    // In a real app, you'd fetch the recipe from a database
    const recipes = [
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

    const recipe = recipes.find(r => r.title === title);
    
    if (!recipe) {
        throw new Error("Recipe not found");
    }

    return c.html(<Page><Recipe recipe={recipe} /></Page>);
});

export default app;


function getPath(): string {
    const path = require('path');
    const parentFolder = path.basename(path.dirname(__filename));
    return parentFolder
}

console.log('Parent folder:', getPath());