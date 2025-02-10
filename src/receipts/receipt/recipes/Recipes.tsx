const RecipeCard = ({ title, ingredients }: { 
    title: string, 
    ingredients: string[]
}) => {
    return (
        <form 
            method="post"
            action="recipe/"
            class="block"
        >
            <input type="hidden" name="title" value={title} />
            {ingredients.map((ingredient, i) => (
                <input type="hidden" name={`ingredients[${i}]`} value={ingredient} />
            ))}
            
            <button type="submit" class="w-full text-left">
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
            </button>
        </form>
    );
};

const Recipes = ({ receipt, recipes }: { receipt: any, recipes: any[] }) => {
    return (
        <div class="max-w-2xl mx-auto px-4 py-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Recipe Suggestions</h1>
            <p class="text-gray-600 mb-6">Based on items from your receipt</p>
            
            <div class="space-y-6">
                {recipes.map((recipe) => (
                    <RecipeCard title={recipe.title} ingredients={recipe.ingredients} />
                ))}
            </div>

            <div id="debug-output" class="mt-8 p-4 bg-gray-100 rounded-lg">
                {/* Debug output will appear here */}
            </div>

            <div class="mt-8">
                <a href="javascript:history.back()" 
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
import openai from '../../../lib/openai';
const app = new Hono();


export async function generateRecipes(receipt: any) {
    const items = receipt.items.map((item: any) => item.name).join(", ");
    
    const prompt = `Generate 2-3 simple recipe suggestions using some of these ingredients: ${items}. 
    Return the response as a JSON array where each recipe has: 
    {
        title: string,
        ingredients: string[],
        instructions: string[]
    }`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { 
                role: "system", 
                content: "You are a helpful cooking assistant that suggests recipes based on available ingredients." 
            },
            { 
                role: "user", 
                content: prompt 
            }
        ],
        response_format: { type: "json_object" },
    });

    try {
        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content in response");
        
        const parsed = JSON.parse(content);
        return parsed.recipes || [];
    } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        return [];
    }
} 

app.post("/", async (c) => {
    const idParam = c.req.param("receipt");
    if (!idParam) {
        throw new Error("Invalid Receipt ID");
    }
    
    const id = parseInt(idParam);
    const receipt = mockReceipts.find(r => r.id === id);

    if (!receipt) {
       throw new Error("Receipt not found");
    }

    // Generate recipes using OpenAI
    const recipes = await generateRecipes(receipt);
    console.log('Generated recipes for receipt:', id);

    return c.html(<Page><Recipes receipt={receipt} recipes={recipes} /></Page>);
});

import Recipe from './recipe/Recipe'
app.route('/recipe/', Recipe)

export default app; 