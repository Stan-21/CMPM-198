import {Monster} from "./Scenes/Monster.js"
import {initializeTools,
  registerTool,
} from "./Tools/ModelConnector.js";
import {sendSystemMessage} from "./Tools/ChatBox.js"
import {ZoomTool} from "./Tools/ZoomTool.js";
import {FaceTool} from "./Tools/FaceTool.js";

// debug with extreme prejudice
"use strict"

const tools = {
  zoom : new ZoomTool(getScene),
  face : new FaceTool(getScene)
}

Object.values(tools).forEach((generator) => {
  if (generator.toolCall) {
    registerTool(generator.toolCall);
  }
})

initializeTools();
sendSystemMessage("Introduce yourself and explain what you can do. ");

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 800,
    height: 600,
    scene: [Monster]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);
console.log(game.scene);

export function getScene() {
  if (!game) throw Error("Scene does not exist >:(");
  console.log(game.scene.scenes[0]);
  return game.scene.scenes[0];
}