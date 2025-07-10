import { tool } from "@langchain/core/tools";
import { Monster } from "../Scenes/Monster.js";
import { z } from "zod";

export class FaceTool {
  sceneGetter;

  constructor(sceneGetter) {
    this.sceneGetter = sceneGetter;
  }

  toolCall = tool(
    async (args) => {
      //TODO Movement logic
      let Monster = this.sceneGetter();
      Monster.switchFace();

      return `Face switched`;
    },
    {
      //The schema of the tool - what the LLM sees beforehand
      name: "switchFace",
      description:
        "Changes the face from smile to a frown",
    },
  );
}