import GameObject from "../../lib/engine/object.js";
import { Color } from "../../lib/graphics/primitive/color.js";
import { Vector2 } from "../../lib/graphics/primitive/vector2.js";
import { createAnimation, createAsset, createFillInfo } from "../../lib/util/graphics.js";
import GameScript from "../GameScript.js";
import Pokemon from "../pokemon/pokemonClass.js";

export default class PlayerScript extends GameScript {
    constructor(engine, battle) {
        super(engine);

        this.battle = battle;

        this.pokemon = null;
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
            .setVisible(false)
            .setLayer(4)
            .setUseCamera(false)
            .setFills([
                createFillInfo("BF", [Color(255, 255, 255), Color(0, 0, 0)], Vector2(2, 2)),
                createFillInfo("BF", [Color(255, 255, 255), Color(0, 0, 0)], Vector2(21, 8))
            ])

        // Player Loading
        const playerAsset = await createAsset('../../assets/player/player-red-sprite-sheet.png');

        const player = new GameObject()
            .setName("player")
            .setSprite(playerAsset, Vector2(17, 24))
            .addToCollisionLayerBlacklist(2)
            .setLayer(1)
            .addAttribute("canMove", false)
            .setPosition(Vector2(1557, 1125))
            .setScale(Vector2(5, 5));

        const playerHitbox = new GameObject()
            .setName("player-hitbox")
            .setVertices([
                Vector2(-7, -8),
                Vector2(7, -8),
                Vector2(7, 10),
                Vector2(-7, 10)
            ])
            .setVisible(false)
            .setLayer(1);

        player.setHitbox(playerHitbox);

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

        player.sprite.setAnimation("idleDown");

        this.objects["player"] = player;
        this.objects["cursor"] = cursor;
        this.engine.addObject(player);
        this.engine.addObject(cursor);

        this.pokemon = await Pokemon.create("charmander");
        this.pokemon.setNick("Broski");
    }

    start() {
        let direction = "Down";

        this.objects["cursor"].bindToUpdate((self, delta, time) => {
            // self.setPosition(this.engine.camera.screenToWorld(this.engine.input.getMousePosition()));
            self.setPosition(this.engine.input.getMousePosition())
        });

        this.objects["player"].bindOnCollision((self, hit) => {
            if (this.engine.state == "battle") {
                return;
            }
            if (this.engine.state == "encountering") {
                return;
            }

            if (hit.name == "boundBox") {
                const selfBounds = self.hitbox.getMinMaxCoords();
                const objBounds = hit.getMinMaxCoords();

                const overlapX = Math.min(selfBounds.maxX, objBounds.maxX) - Math.max(selfBounds.minX, objBounds.minX);
                const overlapY = Math.min(selfBounds.maxY, objBounds.maxY) - Math.max(selfBounds.minY, objBounds.minY);

                if (overlapY < overlapX) {
                    if (self.hitbox.position.y < hit.position.y) {
                        self.position.y -= overlapY;
                        self.hitbox.position.y -= overlapY;
                    } else {
                        self.position.y += overlapY;
                        self.hitbox.position.y += overlapY;
                    }
                    self.velocity.y = 0;
                } else if (overlapY >= overlapX) {
                    if (self.hitbox.position.x < hit.position.x) {
                        self.position.x -= overlapX;
                        self.hitbox.position.x -= overlapX;
                    } else {
                        self.position.x += overlapX;
                        self.hitbox.position.x += overlapX;
                    }
                    self.velocity.x = 0;
                }
            }

            if (hit.name == "battleZone") {
                if (this.engine.state !== "roam" || this.battleCooldown) {
                    return;
                }

                this.battleCooldown = true;
                this.engine.setState("encountering");

                self.setVelocity(Vector2(0,0));
                self.custom_attributes["canMove"] = false;
                self.sprite.setAnimation("idle" + direction);
                

                setTimeout(() => {
                    this.engine.setState("battle");

                    if (Math.random() < 0.5) {
                        this.battle.start(this.pokemon, this.battle.pokemons[1])
                    }
                    else{
                        this.battle.start(this.pokemon, this.battle.pokemons[2])
                    }
                }, 1500);
            }
        });

        this.objects["player"].bindToUpdate((self, delta, time) => {
            if (this.engine.state === "battle") {
                this.wasInBattle = true;
            } else if (this.engine.state === "roam" && this.wasInBattle) {
                this.wasInBattle = false;
                this.battleCooldown = true;
                setTimeout(() => {
                    this.battleCooldown = false;
                }, 5000);
            }


            if (this.engine.state == "battle" || this.engine.state == "encountering" || this.engine.state == "menu" || this.engine.state == "menu-confirmation" || this.engine.state == "loading") {
                self.custom_attributes["canMove"] = false;
                if (this.engine.state == "battle") {
                    self.setVisible(false);
                } else {
                    self.setVisible(true);
                    self.hitbox.setVisible(false);
                }
            } else {
                self.custom_attributes["canMove"] = true;
                self.setVisible(true);
                self.hitbox.setVisible(false);
            }

            if (!self.custom_attributes["canMove"] || this.engine.state == "battle") {
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
            if (this.engine.input.isKeyDown("W")) {
                y = -1;
            }
            if (this.engine.input.isKeyDown("S")) {
                y = 1;
            }

            let moveSpeed = 400;

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
                this.engine.setState("encountering");
                moveSpeed = 0;

                setTimeout(() => {
                    this.engine.setState("battle");
                    this.battle.start(this.pokemon, this.battle.pokemons[1])
                }, 1000);
            }

            self.setVelocity(Vector2(x * moveSpeed, y * moveSpeed));

            if (self.graphics.Transform.magnitude(self.velocity) > 0) {

                if (self.sprite.currentAnimation.includes("run") && self.sprite.currentAnimation == "run" + direction) {
                    return;
                }
                self.sprite.setAnimation("run" + direction);
            } else {
                if (self.sprite.currentAnimation.includes("idle") && self.sprite.currentAnimation == "idle" + direction) {
                    return;
                }
                self.sprite.setAnimation("idle" + direction);
            }
        });

        this.objects["player"].bindToUpdate((self, delta, time) => {
            if (this.engine.state == "menu-confirmation") {
                if (this.engine.input.keysPressed.length > 0 || this.engine.input.mouseButtonsPressed.length > 0) {
                    this.engine.setState("menu");
                }
            }
        });
    }
}