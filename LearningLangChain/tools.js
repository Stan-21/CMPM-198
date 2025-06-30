import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});

import { HumanMessage, SystemMessage } from "@langchain/core/messages";


import { tool } from "@langchain/core/tools";
import { z } from "zod";

const weather = tool(
  async ({latitude, longitude}) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network error');
      }
      const data = await response.json();
      const temperature = data.current_weather.temperature;
      return temperature;
    } catch(error) {
      return null;
    }
  },
  {
    name: "weather",
    description: "Returns weather at latitude and longitude",
    schema: z.object({
      latitude: z.number(),
      longitude: z.number(),
    })
  }
)


const llmWithTools = model.bindTools([weather]);

console.log("=== Example 1: Basic Tool Usage ===");
const response1 = await llmWithTools.invoke([
  new HumanMessage("Weather at 40.7128, -74.0060?")
]);

if (response1.tool_calls && response1.tool_calls.length > 0) {
    const toolResults = [];
    for (const toolCall of response1.tool_calls) {
      let result;
      if (toolCall.name === "weather") {
        result = await weather.invoke(toolCall.args);
      } else if (toolCall.name === "divide") {
        result = await divide.invoke(toolCall.args);
      }
      
      toolResults.push({
        tool: toolCall.name,
        args: toolCall.args,
        result: result
      });
      
      console.log(`${toolCall.name}(${JSON.stringify(toolCall.args)}) = ${result}`);
    }
}
