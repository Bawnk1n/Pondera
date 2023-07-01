import dotenv from 'dotenv'
const OPEN_AI_API = import.meta.env.VITE_OPENAI_API;

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

export async function functionCall(input, language, topic, difficulty, dialect) {
  const messages = [{"role": "user", "content": input}]
  const functions = [
      {
          "name": "display_flash_cards",
          "description": "iterate through an array of 20 objects representing flash cards, and display each one",
          "parameters": {
              "type": "array",
              "items": {
                  "front": {
                      "type": "string",
                      "description": `a ${difficulty} level english word or phrase relating to ${topic}`,
                  },
                  "back": {"type": "string", "description": `A ${dialect} ${language} translation of the english word or phrase in 'front'`},
              },
              "required": ["front", "back"],
          },
      }
  ]
  
  const response = await openai.createChatCompletion(
  {  
    model:"gpt-3.5-turbo-0613",
    messages:messages,
    functions:functions,
    function_call:{"name":"display_flash_cards"} 
  } // auto is default, but we'll be explicit
  )
console.log("here")
  let response_message = response.data.choices[0].message.role
  console.log(response_message)
  response_message = JSON.parse(response_message)

  
  return response_message
}



