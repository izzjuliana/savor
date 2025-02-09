import { OpenAI } from "openai"



export const getRecipes = async (ingredients: { description: string; }[]) => {
    try {
          const apiKey = process.env.API_KEY;

          const openai = new OpenAI({
            apiKey,
          });
         

     
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: `What are some recipes that a user can make based on this list of ingredients: ${ingredients.map(i => i.description).join(", ")}. List all the possible recipes in sequential order` },
                ],
              },
            ],
            max_tokens: 500,
          })
    
    
          if(!response.choices || response.choices.length === 0){
            alert("no response");
            return;
          }
         
          return response.choices[0]?.message?.content?.split("\n ") || [];
        }catch (err){
          console.error(err);
        }
          
  }

