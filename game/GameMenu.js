import GameScript from "./GameScript.js";
import GameObject from "../lib/engine/object.js";
import { Color, Vector2 } from "../lib/graphics/primitive/index.js";
import { createFillInfo } from "../lib/util/graphics.js";
import { createAsset, createAnimation } from "../lib/util/graphics.js";
import Button from "../prefab/button.js";

export default class GameMenu extends GameScript {
    constructor(engine) {
        super(engine);
    }

    loadingScreen() {
        const fontOptions = this.engine.defaultFontOptions;

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

        this.engine.addObject(loadingScreen);
        this.engine.addObject(loadingText);
        this.objects["loading-screen"] = loadingScreen;
        this.objects["loading-text"] = loadingText;
    }

    async mainMenu() {
        const fontOptions = this.engine.defaultFontOptions;

        const menuCoord = new GameObject()
            .setName("menu-coord")
            .setVertices([
                Vector2(0, 0),
            ])
            .setColor(Color(0, 0, 0))
            .setPosition(Vector2(-540, -200))
            .setLayer(2);

        const menuTextAsset = await createAsset('../assets/ui/logo/pokemon_logo.webp');

        const menuText = new GameObject()
            .setName("menu-text")
            .setSprite(menuTextAsset, Vector2(1280, 470))
            .setPosition(Vector2(640, 150))
            .setLayer(2)
            .setScale(Vector2(0.5, 0.5))
            .setUseCamera(false);

        const asset = await createAsset('./assets/player/player-red-sprite-sheet.png')

        const sprite = new GameObject()
            .setName("test")
            .setSprite(asset, Vector2(17, 24))
            .setColor(Color(0, 0, 0))
            .setLayer(1)
            .setPosition(Vector2(-540, -200))
            .setScale(Vector2(5, 5));

        sprite.sprite.addAnimation(createAnimation("idle", [1, -1], "C", 10));
        sprite.sprite.setAnimation("idle");

        const startButton = Button("Start Game", this.engine);
        startButton.setPosition(Vector2(640, 500));
        startButton.setVisible(false);

        this.engine.camera.setTarget(menuCoord);

        this.engine.addObject(menuCoord);
        this.engine.addObject(menuText);
        this.engine.addObject(startButton);
        this.engine.addObject(sprite);
        this.objects["menu-coord"] = menuCoord;
        this.objects["menu-text"] = menuText;
        this.objects["start-button"] = startButton;
        this.objects["sprite"] = sprite;
    }

    async loadAssets() {
        this.loadingScreen();
        await this.mainMenu();
    }

    start() {
        this.engine.setState("loading");

        setTimeout(() => {
            this.objects["loading-text"].setText("Press any key to continue...", this.engine.defaultFontOptions);
            this.engine.setState("menu-confirmation");

            this.objects["loading-screen"].bindToUpdate((self, delta, time) => {
                if (this.engine.state == "menu" && self.fills[0].colors[0].a > 0) {
                    self.fills[0].colors[0].a = Math.max(0, self.fills[0].colors[0].a - 3);
                    const newOpts = { ...this.engine.defaultFontOptions, color: Color(255, 255, 255, self.fills[0].colors[0].a) };
                    this.objects["loading-text"].setText("Press any key to continue...", newOpts);
                }

                if (this.engine.state == "menu" && self.fills[0].colors[0].a <= 0) {
                    this.objects["start-button"].setVisible(true);
                    this.objects["loading-screen"].destroy();
                    this.objects["loading-text"].destroy();
                }
            });
        }, 5000);

        this.engine.physics.findItem("cursor").setVisible(true);

        this.objects["start-button"].bindToUpdate((self, delta, time) => {
            if (self.custom_attributes["clicked"] && this.engine.state == "menu") {
                this.engine.setState("roam");
                const player = this.engine.physics.findItem("player");
                this.engine.camera.setTarget(player);
                player.custom_attributes["canMove"] = true;

                for (let [key, obj] of Object.entries(this.objects)) {
                    obj.destroy();
                }
            }
        })
    }
}