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

                <div class="mt-8 flex justify-between items-center">
                    <a href="javascript:history.back()" 
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
import openai from "../../../../lib/openai"
const app = new Hono();

app.post("/", async (c) => {
    const body = await c.req.parseBody();
    
    // Reconstruct recipe from form data
    const recipe = {
        title: body.title as string,
        ingredients: [] as string[],
        instructions: [] as string[]
    };

    // Parse ingredients from form data
    Object.keys(body).forEach(key => {
        if (key.startsWith('ingredients[')) {
            recipe.ingredients.push(body[key] as string);
        }
    });

    // Generate instructions using OpenAI
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "You are a helpful cooking assistant that provides cooking instructions." 
                },
                { 
                    role: "user", 
                    content: `Generate step-by-step cooking instructions for a recipe titled "${recipe.title}" using these ingredients: ${recipe.ingredients.join(", ")}. Return the response as a JSON array of strings.` 
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content in response");
        
        const parsed = JSON.parse(content);
        recipe.instructions = parsed.instructions || [];
        
        console.log('Generated instructions for recipe:', recipe.title);
    } catch (error) {
        console.error('Error generating instructions:', error);
        recipe.instructions = ["Instructions could not be generated"];
    }

    return c.html(<Page filename={__filename}><Recipe recipe={recipe} /></Page>);
});

export default app;
