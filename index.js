// 2472042 - Gavin Malik Setiawan
import GameObject from "./lib/engine/object.js";
import GameEngine from "./lib/engine/GameEngine.js";
import { Color, Vector2 } from "./lib/graphics/primitive/index.js";
import { toRad } from "../lib/util/math.js";
import { createAnimation, createAsset, createFillInfo, createShake, getFrame } from "./lib/util/graphics.js";
import GameSounds from "./game/GameSounds.js";
import PlayerScript from "./game/player/PlayerScript.js";

const fontOptions = { font: "'Pokemon', monospace", size: 32, color: Color(255, 255, 255) };

const engine = new GameEngine(1280, 720, 4);
engine.setState("loading");
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

const loadingScreen = new GameObject()
    .setName("loading-screen")
    .setVertices([
        Vector2(0, 0),
        Vector2(1280, 0),
        Vector2(1280, 720),
        Vector2(0, 720)
    ])
    .setColor(Color(0, 0, 0))
    .setLayer(3)
    .setFills([
        createFillInfo("R", [Color(0, 0, 0)], Vector2(0, 0), Vector2(1280, 720))
    ])
    .setUseCamera(false);

const loadingText = new GameObject()
    .setName("loading-text")
    .setText("Loading...", fontOptions)
    .setPosition(Vector2(640, 360))
    .setLayer(3)
    .setUseCamera(false);

engine.addObject(loadingScreen);
engine.addObject(loadingText);

const player = new PlayerScript(engine);
const sounds = new GameSounds(engine, player.objects["player"]);

await player.loadAssets();
await sounds.loadAssets();

setTimeout(() => {
    loadingText.setText("Press any key to continue...", fontOptions);
    engine.setState("menu-confirmation");

    loadingScreen.bindToUpdate((self, delta, time) => {
        if (engine.state == "menu" && self.fills[0].colors[0].a > 0) {
            self.fills[0].colors[0].a = Math.max(0, self.fills[0].colors[0].a - 3);
            const newOpts = { ...fontOptions, color: Color(255, 255, 255, self.fills[0].colors[0].a) };
            loadingText.setText("Press any key to continue...", newOpts);
        }

        if (engine.state == "menu" && self.fills[0].colors[0].a <= 0) {
            loadingScreen.destroy();
            loadingText.destroy();
        }
    });
}, 5000);

player.start();
sounds.start();

engine.camera.setTarget(player.objects["player"]);