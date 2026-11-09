import GameObject from "../../lib/engine/object.js";
import { Color } from "../../lib/graphics/primitive/color.js";
import { Vector2 } from "../../lib/graphics/primitive/vector2.js";
import { createAsset, createFillInfo } from "../../lib/util/graphics.js";
import Button from "../../prefab/button.js";
import GameScript from "../GameScript.js";
import Pokemon from "./pokemonClass.js";

export default class Battle extends GameScript {
    constructor(engine) {
        super(engine);

        this.pokemons = [];
    }

    async loadAssets() {
        // Battle Background
        const bgasset = await createAsset("./assets/misc/battle_background_reference.png");

        const bg = new GameObject()
            .setName("battle-bg")
            .setSprite(bgasset)
            .setLayer(2)
            .setVisible(false)
            .setUseCamera(false)
            .setPosition(Vector2(1280 / 2, 720 / 2))
            .setScale(Vector2(1.25, 1.25));

        const charmander = await Pokemon.create("charmander");
        const bulbasaur = await Pokemon.create("bulbasaur");
        const squirtle = await Pokemon.create("squirtle");

        this.pokemons.push(charmander);
        this.pokemons.push(bulbasaur);
        this.pokemons.push(squirtle);

        this.engine.addObject(bg);
        this.objects["battle-bg"] = bg;

        // Actions Panel Background
        const attbg = new GameObject()
            .setName("attbg")
            .setVertices([
                Vector2(-640, -100),
                Vector2(640, -100),
                Vector2(640, 100),
                Vector2(-640, 100)
            ])
            .setFills([
                createFillInfo("R", [Color(150, 150, 150)], Vector2(-639, -99), Vector2(1280, 200))
            ])
            .setPosition(Vector2(640, 620))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(attbg);
        this.objects["attbg"] = attbg;

        // Create UI Panels & Actions
        const mainpanel = this.createActionPanel();
        const actions = this.createActions();
        mainpanel.addChild(actions);

        const infopanel = this.createInfoPanel();

        this.engine.addObject(mainpanel);
        this.engine.addObject(infopanel);

        this.objects["mainactionpanel"] = mainpanel;
        this.objects["actions"] = actions;
        this.objects["infopanel"] = infopanel;
    }

    createActionPanel() {
        const panelWidth = 600;
        const panelHeight = 160;

        const mainpanel = new GameObject()
            .setName("mainactionpanel")
            .setColor(Color(0, 0, 0))
            .setVertices([
                Vector2(-panelWidth / 2, -panelHeight / 2),
                Vector2(panelWidth / 2, -panelHeight / 2),
                Vector2(panelWidth / 2, panelHeight / 2),
                Vector2(-panelWidth / 2, panelHeight / 2)
            ])
            .setFills([
                createFillInfo("R", [Color(80, 80, 80), Color(0, 0, 0)], Vector2(-panelWidth / 2 + 1, -panelHeight / 2 + 1), Vector2(panelWidth - 1, panelHeight - 1))
            ])
            .setPosition(Vector2(320, 620))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        return mainpanel;
    }

    createInfoPanel() {
        const panelWidth = 600;
        const panelHeight = 160;

        const infopanel = new GameObject()
            .setName("infopanel")
            .setColor(Color(0, 0, 0))
            .setVertices([
                Vector2(-panelWidth / 2, -panelHeight / 2),
                Vector2(panelWidth / 2, -panelHeight / 2),
                Vector2(panelWidth / 2, panelHeight / 2),
                Vector2(-panelWidth / 2, panelHeight / 2)
            ])
            .setFills([
                createFillInfo("R", [Color(80, 80, 80), Color(0, 0, 0)], Vector2(-panelWidth / 2 + 1, -panelHeight / 2 + 1), Vector2(panelWidth - 1, panelHeight - 1))
            ])
            .setPosition(Vector2(960, 620))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        const infoText = new GameObject()
            .setName("infotext")
            .setText("What will you do?", { ...this.engine.defaultFontOptions, size: 28 })
            .setLocalPosition(Vector2(0, 0))
            .setLayer(3)
            .setUseCamera(false);

        infopanel.addChild(infoText);
        infopanel.setVisible(false);
        this.objects["infotext"] = infoText;

        return infopanel;
    }

    createActions() {
        const actions = new GameObject()
            .setName("actions")
            .setUseCamera(false);

        const btnOptions = { size: Vector2(170, 50), layer: 3 };

        const attackBtn = Button("Attack", this.engine, btnOptions)
            .setName("attack-btn")
            .setLocalPosition(Vector2(-190, 0))
            .setUseCamera(false);

        const catchBtn = Button("Catch", this.engine, btnOptions)
            .setName("catch-btn")
            .setLocalPosition(Vector2(0, 0))
            .setUseCamera(false);

        const fleeBtn = Button("Flee", this.engine, btnOptions)
            .setName("flee-btn")
            .setLocalPosition(Vector2(190, 0))
            .setUseCamera(false);

        actions.addChild(attackBtn);
        actions.addChild(catchBtn);
        actions.addChild(fleeBtn);

        actions.setVisible(false);

        this.engine.addObject(attackBtn);
        this.engine.addObject(catchBtn);
        this.engine.addObject(fleeBtn);

        this.objects["attack-btn"] = attackBtn;
        this.objects["catch-btn"] = catchBtn;
        this.objects["flee-btn"] = fleeBtn;

        return actions;
    }

    createAttacks(attackSet) {
        const attacks = new GameObject()
            .setName("attacks")
            .setUseCamera(false);

        const btnOptions = { size: Vector2(170, 50), layer: 3 };

        // const attackBtn = Button("Attack", this.engine, btnOptions)
        //     .setName("attack-btn")
        //     .setLocalPosition(Vector2(-190, 0))
        //     .setUseCamera(false);

        // const catchBtn = Button("Catch", this.engine, btnOptions)
        //     .setName("catch-btn")
        //     .setLocalPosition(Vector2(0, 0))
        //     .setUseCamera(false);

        // const fleeBtn = Button("Flee", this.engine, btnOptions)
        //     .setName("flee-btn")
        //     .setLocalPosition(Vector2(190, 0))
        //     .setUseCamera(false);

        for (let [key, value] of Object.entries(attackSet)) {
            
        }

        // attacks.addChild(attackBtn);
        // attacks.addChild(catchBtn);
        // attacks.addChild(fleeBtn);

        // this.engine.addObject(attackBtn);
        // this.engine.addObject(catchBtn);
        // this.engine.addObject(fleeBtn);

        // this.objects["attack-btn"] = attackBtn;
        // this.objects["catch-btn"] = catchBtn;
        // this.objects["flee-btn"] = fleeBtn;

        return attacks;
    }

    start(player, target) {
        this.objects["battle-bg"].setVisible(true);
        this.objects["attbg"].setVisible(true);
        this.objects["mainactionpanel"].setVisible(true);
        this.objects["infopanel"].setVisible(true);

        const movePlayer = (self, delta, time) => {
            if (self.position.x < 375) {
                self.position.x += 1500 * delta;
            } else {
                self.removeFromUpdateBind(movePlayer);
            }
        };

        const moveTarget = (self, delta, time) => {
            if (self.position.x > 1050) {
                self.position.x -= 1500 * delta;
            } else {
                self.removeFromUpdateBind(moveTarget);
            }
        };

        player.bindToUpdate(movePlayer);
        target.bindToUpdate(moveTarget);

        player.setPosition(Vector2(-150, 400));
        player.sprite.setCurrentFrame([0, 1]);
        player.setScale(Vector2(6, 6));

        target.setPosition(Vector2(1500, 200));
        target.setScale(Vector2(3, 3));

        this.engine.addObject(player);
        this.engine.addObject(target);

        const attacks = this.createAttacks(player.attackSet);

        this.objects["mainactionpanel"].addChild(attacks);
        attacks.setVisible(false);

        const attackButtonBind = (self, delta, time) => {
            if (this.engine.state != "battle") {
                self.removeFromUpdateBind(attackButtonBind);
                return;
            }

            if (self.custom_attributes["clicked"]) {
                attacks.setVisible(true)
                this.objects["actions"].setVisible(false);
            }
        };

        this.objects["attack-btn"].bindToUpdate(attackButtonBind);
    }
}
