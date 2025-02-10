const RecipeCard = ({ title, ingredients }: { 
    title: string, 
    ingredients: string[]
}) => {
    return (
        <a href={`${encodeURIComponent(title)}/`} class="block">
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

const Recipes = () => {
    const recipes = [
        {
            title: "Quick Pasta Dish",
            ingredients: [
                "Pasta",
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
                "Fresh vegetables",
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
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-2xl font-bold text-gray-800">Recipe Cards</h1>
                <a href=".." 
                    class="text-blue-600 hover:text-blue-800 font-medium">
                    ← Back to Home
                </a>
            </div>
            
            <div class="space-y-6">
                {recipes.map((recipe) => (
                    <RecipeCard title={recipe.title} ingredients={recipe.ingredients} />
                ))}
            </div>
        </div>
    );
};

import { Hono } from "hono";
import Page from "../Page";
const app = new Hono();

app.get("/", (c) => {
    return c.html(<Page filename={__filename}><Recipes /></Page>);
});

import Recipe from './recipe/Recipe';
app.route("/:recipe/", Recipe);

export default app;
