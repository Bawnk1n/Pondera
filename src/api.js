
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





