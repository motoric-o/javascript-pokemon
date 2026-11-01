// 2472042 - Gavin Malik Setiawan
import GameObject from "./lib/engine/object.js";
import GameEngine from "./lib/engine/GameEngine.js";
import { Color, Vector2 } from "./lib/graphics/primitive/index.js";
import { toRad } from "../lib/util/math.js";
import { createAnimation, createAsset, createFillInfo, createShake, getFrame } from "./lib/util/graphics.js";
import GameSounds from "./game/GameSounds.js";
import PlayerScript from "./game/player/PlayerScript.js";


const engine = new GameEngine(1280, 720, 4);
engine.setState("loading");
engine.sound.setVolume(0.25);
engine.start();

const asset = await createAsset('./assets/player/player-red-sprite-sheet.png')
console.log(asset)

const test2 = new GameObject()
    .setName("test")
    .setSprite(asset, Vector2(17, 24))
    .setColor(Color(0, 0, 0))
    .setPosition(Vector2(640, 360))
    .setLayer(1)
    .setScale(Vector2(5, 5));

engine.addObject(test2);

const player = new PlayerScript(engine);
const sounds = new GameSounds(engine, player.objects["player"]);

await player.loadAssets();
await sounds.loadAssets();

player.start();
sounds.start();

engine.camera.setTarget(player.objects["player"]);