import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  BaseMessage,
  ToolMessage,
  SystemMessage,
} from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  maxRetries: 2,
  apiKey: import.meta.env.VITE_LLM_API_KEY
});

const sysPrompt = 
"You are 'Pewter, an expert tile-based map designer by day, but an incredible video game player by night. " +
    'Your goal is to assist the player in finishing a game called "GravFlux", an exciting new game where the player has the ability to invert gravity on command. The player needs to collect all of the part canisters to save the world and you are going to help them! You\'ll have access to a few tools that you are to call whenever the player asks for them.';

let tools = [];
let toolsByName = {};
let llmWithTools;

export function registerTool(tool) {
    if (toolsByName[tool.name]) {
        console.warn(`Tool "${tool.name}" already registered; overwriting.`);
    }
    tools.push(tool);
    toolsByName[tool.name] = tool;
    console.log("Tool Registered: ", tool.name);
}

export function initializeTools() {
    llmWithTools = model.bindTools(tools);
}

export async function initializeLLM(chatMessageHistory) {
    chatMessageHistory.push(new SystemMessage(sysPrompt));
}

export async function getChatResponse(chatMessageHistory) {
if (!llmWithTools) {
    throw new Error("LLM has not be initialized yet! Stop breaking stuff");
  }

  try {
    let response = await llmWithTools.invoke(chatMessageHistory);
    console.log(
      `Message sent to LLM`,
      chatMessageHistory,
      `and received: `,
      response,
    );

    //VERY IMPORTANT --- Push the fact that a tool was called back into the chat history or stuff will break
    chatMessageHistory.push(response);

    //Match the tool and execute
    const calls = response.tool_calls ?? [];
    for (const toolCall of calls) {
    console.log(toolsByName);
      const selectedTool = toolsByName[toolCall.name];
      if (!selectedTool) {
        const msg = `Error: Unknown tool "${toolCall.name}".`;
        console.error(msg);
        chatMessageHistory.push(
          new ToolMessage({
            name: toolCall.name,
            content: msg,
            tool_call_id: String(toolCall.id || ""),
          }),
        );
        continue;
      }
      try {
        const result = await selectedTool.invoke(toolCall.args);
        console.log(`Tool called ${toolCall.name} with result: ${result}`);

        chatMessageHistory.push(
          new ToolMessage({
            name: toolCall.name,
            content: result,
            tool_call_id: String(toolCall.id || ""),
          }),
        );
      } catch (toolError) {
        console.error(`Tool ${toolCall.name} failed:`, toolError);
        // Add error message to chat history
        const errorMessage =
          `Error: Tool '${toolCall.name}' failed with args: ${JSON.stringify(toolCall.args)}.\n` +
          `Details: ${toolError}. Please try again with different parameters.`;

        chatMessageHistory.push(
          new ToolMessage({
            name: toolCall.name,
            content: errorMessage,
            tool_call_id: String(toolCall.id ?? ""),
          }),
        );
      }
    }
    //In order for the result to be used, it needs to be sent back to the llm
    if (calls.length > 0) {
      response = await llmWithTools.invoke(chatMessageHistory);
      console.log("Raw LLM response after tool calls: ", response);
    }

    let resultContent = response.content;
    if (typeof resultContent !== "string") {
      console.log(
        "Non-string AI response detected, need to fix this later:",
        resultContent,
      );
      resultContent = JSON.stringify(resultContent);
    }
    return resultContent;
  } catch (error) {
    console.error(
      "Error during tool call. THIS WILL BREAK EVERYTHING: ",
      error,
    );
    return "Error communicating with model :(";
  }
}