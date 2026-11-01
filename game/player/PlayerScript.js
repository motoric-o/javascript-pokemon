import GameObject from "../../lib/engine/object.js";
import { Color } from "../../lib/graphics/primitive/color.js";
import { Vector2 } from "../../lib/graphics/primitive/vector2.js";
import { createAnimation, createAsset, createFillInfo } from "../../lib/util/graphics.js";
import GameScript from "../GameScript.js";

export default class PlayerScript extends GameScript {
    constructor(engine) {
        super(engine);
    }

    async loadAssets() {
        // Cursor
        const cursor = new GameObject()
            .setName("cursor")
            .setColor(Color(0, 0, 0))
            .setVertices([
                Vector2(0, 0),
                Vector2(25, 10),
                Vector2(12, 12),
                Vector2(8, 25)
            ])
            .setLayer(3)
            // .setUseCamera(false)
            .setFills([
                createFillInfo("BF", [Color(0, 255, 255), Color(0, 0, 0)], Vector2(2, 2))
            ])

        const circle = new GameObject()
            .setName("circle")
            .setVertices([
                Vector2(0, 0)
            ])
            .setColor(Color(0, 0, 0))
            .setFills([
                createFillInfo("BF", [Color(255, 0, 0), Color(0, 0, 0)], Vector2(0, 0))
            ])
            .setLayer(3)
            .setRadius(50)
            .setPosition(Vector2(-100, -100))
            .setVelocity(Vector2(0, 50))


        // Player Loading
        const playerAsset = await createAsset('../../assets/player/player-red-sprite-sheet.png');

        const player = new GameObject()
            .setName("Player")
            .setSprite(playerAsset, Vector2(17, 24))
            // .setUseCamera(true)
            .addToCollisionLayerBlacklist(2)
            .setLayer(1)
            .addAttribute("canMove", true)
            .setScale(Vector2(5, 5));

        const runDown = createAnimation("runDown", [0, 1, 2, 1, -1], "C", 10);
        const runUp = createAnimation("runUp", [3, 4, 5, 4, -1], "C", 10);
        const runLeft = createAnimation("runLeft", [6, 7, 8, 7, -1], "C", 10);
        const runRight = createAnimation("runRight", [9, 10, 11, 10, -1], "C", 10);
        const idleDown = createAnimation("idleDown", [1, -1], "C", 10);
        const idleUp = createAnimation("idleUp", [4, -1], "C", 10);
        const idleLeft = createAnimation("idleLeft", [7, -1], "C", 10);
        const idleRight = createAnimation("idleRight", [10, -1], "C", 10);

        player.sprite.addAnimation(runDown);
        player.sprite.addAnimation(runUp);
        player.sprite.addAnimation(runLeft);
        player.sprite.addAnimation(runRight);
        player.sprite.addAnimation(idleDown);
        player.sprite.addAnimation(idleUp);
        player.sprite.addAnimation(idleLeft);
        player.sprite.addAnimation(idleRight);

        this.objects["player"] = player;
        this.objects["cursor"] = cursor;
        this.objects["circle"] = circle;
        this.engine.addObject(player);
        this.engine.addObject(cursor);
        this.engine.addObject(circle);
    }

    start() {
        let direction = "Down";

        this.objects["cursor"].bindToUpdate((self, delta, time) => {
            self.setPosition(this.engine.camera.screenToWorld(this.engine.input.getMousePosition()));
            // self.setPosition(this.engine.input.getMousePosition())
        });

        // this.objects["circle"].bindToUpdate((self, delta, time) => {
        //     self.setPosition(this.engine.camera.screenToWorld(this.engine.input.getMousePosition()));
        //     // self.setPosition(this.engine.input.getMousePosition())
        // });

        this.objects["player"].bindToUpdate((self, delta, time) => {
            if (!this.objects["player"].custom_attributes["canMove"]) {
                return;
            }

            let x = 0;
            let y = 0;

            if (this.engine.input.isKeyDown("D")) {
                x = 1;
            }
            if (this.engine.input.isKeyDown("A")) {
                x = -1;
            }
            if (this.engine.input.isKeyDown("w")) {
                y = -1;
            }
            if (this.engine.input.isKeyDown("s")) {
                y = 1;
            }


            let moveSpeed = 400;

            let mouseDelta = this.engine.input.getWheelDelta();

            this.engine.camera.setZoom(this.engine.camera.zoom - mouseDelta * 0.001);

            if (x == 1) {
                direction = "Right";
            } else if (x == -1) {
                direction = "Left";
            }

            if (y == 1) {
                direction = "Down";
            } else if (y == -1) {
                direction = "Up";
            }


            if (this.engine.input.isKeyPressed(" ")) {
                self.setPosition(Vector2(250, 250));
                
                this.engine.setState("encountering");

                setTimeout(() => {
                    this.engine.setState("battle");
                }, 1000);
            }

            self.setVelocity(Vector2(x * moveSpeed, y * moveSpeed));

            if (self.graphics.Transform.magnitude(self.velocity) < 1) {
                if (self.sprite.currentAnimation.includes("idle")) {
                    return;
                }
                self.sprite.setAnimation("idle" + direction);
            } else {
                if (self.sprite.currentAnimation.includes("run") && self.sprite.currentAnimation == "run" + direction) {
                    return;
                }
                self.sprite.setAnimation("run" + direction);
            }
        });
    }
}