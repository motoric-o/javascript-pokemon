// 2472042 - Gavin Malik Setiawan
import GameObject from "./lib/engine/object.js";
import GameEngine from "./lib/engine/GameEngine.js";
import { Color, Vector2 } from "./lib/graphics/primitive/index.js";
import { toRad } from "../lib/util/math.js";
import { createAnimation, createAsset, createFillInfo, createShake, getFrame } from "./lib/util/graphics.js";
import GameSounds from "./game/GameSounds.js";
import GameMenu from "./game/GameMenu.js";
import PlayerScript from "./game/player/PlayerScript.js";

const fontOptions = { font: "'Pokemon', monospace", size: 32, color: Color(255, 255, 255) };

const engine = new GameEngine(1280, 720, 4);
engine.setDefaultFontOptions(fontOptions);
engine.setState("loading");
engine.start();

const asset = await createAsset('./assets/player/player-red-sprite-sheet.png')
console.log(asset)

const test2 = new GameObject()
    .setName("test")
    .setSprite(asset, Vector2(17, 24))
    .setColor(Color(0, 0, 0))
    .setLayer(1)
    .setScale(Vector2(5, 5));

test2.sprite.addAnimation(createAnimation("idle", [1, -1], "C", 10));
test2.sprite.setAnimation("idle");
engine.addObject(test2);

const menu = new GameMenu(engine);
const player = new PlayerScript(engine);
const sounds = new GameSounds(engine, player.objects["player"]);

await menu.loadAssets();
await player.loadAssets();
await sounds.loadAssets();
menu.start();

player.start();
sounds.start();