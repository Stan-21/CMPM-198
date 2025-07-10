import { tool } from "@langchain/core/tools";
import { Monster } from "../Scenes/Monster.js";
import { z } from "zod";

export class ZoomTool {
  sceneGetter;

  constructor(sceneGetter) {
    this.sceneGetter = sceneGetter;
  }

  static zoomArgsSchema = z.object({
    zoomLevel: z.number().min(0).max(10).default(2),
  });

  toolCall = tool(
    async (args) => {
      //TODO Movement logic
      let Monster = this.sceneGetter();
      Monster.zoomMap(args.zoomLevel);

      return `Game is now zoomed to level ${args.zoomLevel}`;
    },
    {
      //The schema of the tool - what the LLM sees beforehand
      name: "zoomMap",
      schema: ZoomTool.zoomArgsSchema,
      description:
        "Changes the zoom level of the map. The zoom level is a number between 0 and 10, where 2 is the default zoom level. You can use decimals for finer control, e.g., 1.5 for a zoom level between 1 and 2.",
    },
  );
}