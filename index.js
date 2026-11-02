import GameEngine from "./lib/engine/GameEngine.js";
import { Color } from "./lib/graphics/primitive/index.js";
import GameSounds from "./game/GameSounds.js";
import GameMenu from "./game/GameMenu.js";
import PlayerScript from "./game/player/PlayerScript.js";
import MapScript from "./game/MapScript.js";

const fontOptions = { font: "'Pokemon', monospace", size: 32, color: Color(255, 255, 255) };

const engine = new GameEngine(1280, 720, 4);
engine.setDefaultFontOptions(fontOptions);
engine.setState("loading");
engine.start();

const menu = new GameMenu(engine);
const player = new PlayerScript(engine);
const sounds = new GameSounds(engine, player.objects["player"]);
const map = new MapScript(engine);

await menu.loadAssets();
await player.loadAssets();
await sounds.loadAssets();
await map.loadAssets();

menu.start();

player.start();
sounds.start();
map.start();