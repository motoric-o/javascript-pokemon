import GameObject from "../../lib/engine/object.js";
import { Color } from "../../lib/graphics/primitive/color.js";
import { Vector2 } from "../../lib/graphics/primitive/vector2.js";
import { createAsset, createFillInfo } from "../../lib/util/graphics.js";
import Button from "../../prefab/button.js";
import GameScript from "../GameScript.js";
import Dialogue from "./Dialogue.js";
import Pokemon from "./pokemonClass.js";

export default class Battle extends GameScript {
    constructor(engine) {
        super(engine);

        this.pokemons = [];
        this.dialogue = new Dialogue();
        this.turn = "Player";
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

        this.createHealthBars();
    }

    createHealthBars() {
        // Create Health Bars

        const playerHealthBG = new GameObject()
            .setName("player-health-bg")
            .setVertices([
                Vector2(-160, -35),
                Vector2(160, -35),
                Vector2(160, 20),
                Vector2(-160, 20)
            ])
            .setFills([
                createFillInfo("R", [Color(150, 150, 150), Color(0, 0, 0)], Vector2(-159, -34), Vector2(319, 55))
            ])
            .setPosition(Vector2(380, 280))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(playerHealthBG);
        this.objects["player-health-bg"] = playerHealthBG;

        const playerName = new GameObject()
            .setName("player-name")
            .setText("Player", { ...this.engine.defaultFontOptions, size: 16 })
            .setPosition(Vector2(380, 262))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(playerName);
        this.objects["player-name"] = playerName;

        const playerHealthBar = new GameObject()
            .setName("player-health-bar")
            .setVertices([
                Vector2(-150, -10),
                Vector2(150, -10),
                Vector2(150, 10),
                Vector2(-150, 10)
            ])
            .setFills([
                createFillInfo("R", [Color(0, 255, 0)], Vector2(-149, -9), Vector2(299, 18))
            ])
            .setPosition(Vector2(380, 280))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(playerHealthBar);
        this.objects["player-health-bar"] = playerHealthBar;

        const targetHealthBG = new GameObject()
            .setName("target-health-bg")
            .setVertices([
                Vector2(-160, -35),
                Vector2(160, -35),
                Vector2(160, 20),
                Vector2(-160, 20)
            ])
            .setFills([
                createFillInfo("R", [Color(150, 150, 150), Color(0, 0, 0)], Vector2(-159, -34), Vector2(319, 55))
            ])
            .setPosition(Vector2(1030, 80))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(targetHealthBG);
        this.objects["target-health-bg"] = targetHealthBG;

        const targetName = new GameObject()
            .setName("target-name")
            .setText("Target", { ...this.engine.defaultFontOptions, size: 16 })
            .setPosition(Vector2(1030, 62))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(targetName);
        this.objects["target-name"] = targetName;


        const targetHealthBar = new GameObject()
            .setName("target-health-bar")
            .setVertices([
                Vector2(-150, -10),
                Vector2(150, -10),
                Vector2(150, 10),
                Vector2(-150, 10)
            ])
            .setFills([
                createFillInfo("R", [Color(0, 255, 0)], Vector2(-149, -9), Vector2(299, 18))
            ])
            .setPosition(Vector2(1030, 80))
            .setLayer(3)
            .setUseCamera(false)
            .setVisible(false);

        this.engine.addStaticObject(targetHealthBar);
        this.objects["target-health-bar"] = targetHealthBar;
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
            .setLocalPosition(Vector2(-130, 0))
            .setUseCamera(false);

        const fleeBtn = Button("Flee", this.engine, btnOptions)
            .setName("flee-btn")
            .setLocalPosition(Vector2(130, 0))
            .setUseCamera(false);

        actions.addChild(attackBtn);
        actions.addChild(fleeBtn);

        actions.setVisible(false);

        this.engine.addObject(attackBtn);
        this.engine.addObject(fleeBtn);

        this.objects["attack-btn"] = attackBtn;
        this.objects["flee-btn"] = fleeBtn;

        return actions;
    }

    createAttacks(attackSet) {
        const attacks = new GameObject()
            .setName("attacks")
            .setUseCamera(false);

        const btnOptions = { size: Vector2(170, 50), layer: 3 };

        for (let attackName in attackSet) {
            const attackBtn = Button(attackName, this.engine, btnOptions)
                .setName(`${attackName}-btn`)
                .setLocalPosition(Vector2(-130 + (Object.keys(attackSet).indexOf(attackName) * 260), 0))
                .setUseCamera(false);
            attacks.addChild(attackBtn);
            this.engine.addObject(attackBtn);
            this.objects[`${attackName}-btn`] = attackBtn;

        }

        return attacks;
    }

    setMessage(category, action, params = {}) {
        const text = this.dialogue.get(category, action, params);
        this.objects["infotext"].setText(text, { ...this.engine.defaultFontOptions, size: 28 });
    }

    updateHealthBar(targetType, pokemon) {
        const fullBarWidth = 299;
        const bar = this.objects[`${targetType}-health-bar`];
        bar.fills[0].size.x = fullBarWidth * pokemon.getHealthRatio();
    }

    start(player, target) {
        this.startBattle(player, target);

        const attacks = this.createAttacks(player.attackSet);
        this.objects["attacks"] = attacks;

        const handleTargetDead = () => {
            this.setMessage("status", "faint", { name: `${target.nick.toUpperCase()}` })
            setTimeout(() => {
                this.endBattle(player, target);
            }, 2000);
        }

        if (this.objects["mainactionpanel"].children.includes(this.objects["attacks"])) {
            this.objects["mainactionpanel"].children = this.objects["mainactionpanel"].children.filter(child => child !== this.objects["attacks"]);
        }

        this.objects["mainactionpanel"].addChild(attacks);
        attacks.setVisible(false);

        const attackButtonBind = (self, delta, time) => {
            if (this.engine.state != "battle") {
                self.removeFromUpdateBind(attackButtonBind);
                return;
            }

            if (self.custom_attributes["clicked"]) {
                self.custom_attributes["clicked"] = false;

                this.canChooseAttack = false;
                attacks.setVisible(true)
                this.objects["actions"].setVisible(false);
                this.objects["infotext"].setText("Choose an attack!", { ...this.engine.defaultFontOptions, size: 28 });

                setTimeout(() => {
                    this.canChooseAttack = true;
                }, 150);
            }
        };

        this.objects["attack-btn"].bindToUpdate(attackButtonBind);

        const fleeButtonBind = (self, delta, time) => {
            if (this.engine.state != "battle") {
                self.removeFromUpdateBind(fleeButtonBind);
                return;
            }

            if (self.custom_attributes["clicked"]) {
                self.custom_attributes["clicked"] = false;
                this.objects["infotext"].setText("You fled the battle!", { ...this.engine.defaultFontOptions, size: 28 });
                setTimeout(() => { this.endBattle(player, target); }, 1500);
            }
        }

        this.objects["flee-btn"].bindToUpdate(fleeButtonBind);

        for (let attackName in player.attackSet) {
            const attackBtn = this.objects[`${attackName}-btn`];

            const onAttackBtnUpdate = (self, delta, time) => {
                if (this.engine.state != "battle") {
                    self.removeFromUpdateBind(onAttackBtnUpdate);
                    return;
                }

                if (!this.canChooseAttack) {
                    self.custom_attributes["clicked"] = false;
                    return;
                }

                if (self.custom_attributes["clicked"]) {
                    self.custom_attributes["clicked"] = false;
                    attacks.setVisible(false);
                    const damage = target.calculateDamage(player, attackName);

                    const onHit = () => {
                        target.hurt(damage.damage);

                        this.updateHealthBar("target", target);
                        this.setMessage("attack", "use", { name: player.nick.toUpperCase(), attack: attackName });
                    }

                    const onComplete = () => {
                        setTimeout(() => {
                            this.setMessage("attack", damage.effectKey);
                            if (target.isFainted()) {
                                handleTargetDead();
                                this.setMessage("status", "faint", { name: target.nick.toUpperCase() });
                            } else {
                                this.turn = "Enemy";
                                setTimeout(() => {
                                    cycle();
                                }, 2000)
                            }
                        }, 1000);
                    }

                    player.attack(attackName, target, this.engine, { onHit, onComplete });
                }

            };

            attackBtn.bindToUpdate(onAttackBtnUpdate);
        }

        const cycle = () => {
            if (this.turn == "Enemy") {
                this.setMessage("battle", "question", { name: target.nick.toUpperCase() });
                this.objects["actions"].setVisible(false);

                setTimeout(() => {
                    const attackNames = Object.keys(target.attackSet);
                    const randomAttackName = attackNames[Math.floor(Math.random() * attackNames.length)];
    
                    this.setMessage("attack", "use", { name: target.nick.toUpperCase(), attack: randomAttackName });
                    const damage = player.calculateDamage(target, randomAttackName);
    
                    const onHit = () => {
                        player.hurt(damage.damage);
    
                        this.updateHealthBar("player", player);
                        this.setMessage("attack", "use", { name: target.nick.toUpperCase(), attack: randomAttackName });
                    }
    
                    const onComplete = () => {
                        setTimeout(() => {
                            this.setMessage("attack", damage.effectKey);
                            if (player.isFainted()) {
                                this.setMessage("status", "faint", { name: player.nick.toUpperCase() });
                                setTimeout(() => {
                                    this.endBattle(player, target);
                                    clearInterval(cycle);
                                }, 2000);
                            } else {
                                this.turn = "Player";
                                setTimeout(() => {
                                    cycle();
                                }, 2000)
                            }
                        }, 1000);
                    }
    
                    target.attack(randomAttackName, player, this.engine, { onHit, onComplete });
                }, 2000);

            } else {
                this.setMessage("battle", "question", { name: player.nick.toUpperCase() });
                setTimeout(() => {
                    this.objects["actions"].setVisible(true)
                }, 1000);
            }
        }

        cycle();
    }

    startBattle(player, target) {
        if (this.objects["attacks"]) {
            for (let child of this.objects["attacks"].children) {
                child.destroy();
            }
        }

        player.initBattle();
        target.initBattle();

        this.turn = "Enemy";
        const random = Math.random();

        this.objects["player-health-bar"].fills[0].size.x = 299;
        this.objects["target-health-bar"].fills[0].size.x = 299;

        this.objects["battle-bg"].setVisible(true);
        this.objects["attbg"].setVisible(true);
        this.objects["mainactionpanel"].setVisible(true);
        this.objects["infopanel"].setVisible(true);
        this.objects["infotext"].setText("What will you do?", { ...this.engine.defaultFontOptions, size: 28 });

        if (random > 0.5) {
            this.turn = "Enemy";
            this.objects["actions"].setVisible(false);
        } else {
            this.objects["actions"].setVisible(true);
        }

        player.setVisible(true);
        target.setVisible(true);

        const movePlayer = (self, delta, time) => {
            if (self.position.x < 375) {
                self.position.x += 1500 * delta;
            } else {
                self.removeFromUpdateBind(movePlayer);
                this.objects["player-health-bg"].setVisible(true);
                this.objects["player-health-bar"].setVisible(true);
                this.objects["player-name"].setText(player.nick.toUpperCase(), { ...this.engine.defaultFontOptions, size: 16 })
                this.objects["player-name"].setVisible(true);
            }
        };

        const moveTarget = (self, delta, time) => {
            if (self.position.x > 1050) {
                self.position.x -= 1500 * delta;
            } else {
                self.removeFromUpdateBind(moveTarget);
                this.objects["target-health-bg"].setVisible(true);
                this.objects["target-health-bar"].setVisible(true);
                this.objects["target-name"].setText(target.nick.toUpperCase(), { ...this.engine.defaultFontOptions, size: 16 })
                this.objects["target-name"].setVisible(true);
            }
        };

        player.bindToUpdate(movePlayer);
        target.bindToUpdate(moveTarget);

        player.setPosition(Vector2(-150, 400));
        player.sprite.setCurrentFrame([0, 1]);
        player.setScale(Vector2(6, 6));

        target.setPosition(Vector2(1500, 200));
        target.setScale(Vector2(3, 3));

        if (!this.engine.physics.objects.includes(player)) {
            this.engine.addObject(player);
        }
        if (!this.engine.physics.objects.includes(target)) {
            this.engine.addObject(target);
        }
    }

    endBattle(player, target) {
        this.engine.setState("roam");

        this.objects["battle-bg"].setVisible(false);
        this.objects["attbg"].setVisible(false);
        this.objects["mainactionpanel"].setVisible(false);
        this.objects["infopanel"].setVisible(false);
        this.objects["player-health-bg"].setVisible(false);
        this.objects["player-health-bar"].setVisible(false);
        this.objects["player-name"].setVisible(false);
        this.objects["target-health-bg"].setVisible(false);
        this.objects["target-health-bar"].setVisible(false);
        this.objects["target-name"].setVisible(false);

        player.setVisible(false);
        target.setVisible(false);
    }
}
