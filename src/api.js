
const OPEN_AI_API = "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";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: OPEN_AI_API,
});
const openai = new OpenAIApi(configuration);

export async function createDeck(input) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You follow directions TO A TEE. RESPOND ONLY WITH THE REQUESTED CODE IN VALID JSON FORMAT. NO DIALOGUE."}, {role: "user", content: input}],
      });      
      let jsonStr = completion.data.choices[0].message.content;
      return JSON.parse(jsonStr)
}

//  would it be possibly to get it to generate an array of 20 objects off the bat, or to make them one at a time and run
//  them through a while loop or some such

export async function functionCall(input) {
  const messages = [{"role": "user", "content": input}]
  const functions = [
      {
          "name": "display_flash_cards",
          "description": "iterate through an array of 20 objects representing flash cards, and display each one",
          "parameters": {
              "type": "array",
              "properties": {
                  "front": {
                      "type": "string",
                      "description": "An english word",
                  },
                  "back": {"type": "string", "description": "A translation of the word in 'front'"},
              },
              "required": ["front", "back"],
          },
      }
  ]
  const response = openai.ChatCompletion.create(
  {  
    model:"gpt-3.5-turbo-0613",
    messages:messages,
    functions:functions,
    function_call:"none", 
  } // auto is default, but we'll be explicit
)
  response_message = response["function_call"]["arguments"]

  response_message = JSON.parse(response_message)

  console.log(response_message)
}



