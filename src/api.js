
const OPEN_AI_API = "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";

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: OPEN_AI_API,
});
const openai = new OpenAIApi(configuration);

export async function createDeck(input) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{"role": "system", "content": "You are a JSON Object Generator, reply only with the requested JSON Object, or 'fail' and the reason for failure, if the instructions are not adequately clear. NO OTHER DIALOGUE"}, {role: "user", content: input}],
      });
      
      let jsonStr = completion.data.choices[0].message.content;
        //jsonStr = jsonStr.replace(/(\r\n|\n|\r|\s+)/gm, ""); // This removes all newlines and extra whitespace
        console.log(jsonStr);
      return JSON.parse(jsonStr)
}



