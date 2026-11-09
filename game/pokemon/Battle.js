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
                createFillInfo("R", [Color(150, 150, 150), Color(0, 0, 0)], Vector2(-159, -34), Vector2(318, 58))
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
                createFillInfo("R", [Color(0, 255, 0)], Vector2(-149, -9), Vector2(300, 18))
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
                createFillInfo("R", [Color(150, 150, 150), Color(0, 0, 0)],Vector2(-159, -34), Vector2(318, 58))
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
                createFillInfo("R", [Color(0, 255, 0)], Vector2(-149, -9), Vector2(300, 18))
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

    start(player, target) {

        if (this.objects["attacks"]) {
            for (let child of this.objects["attacks"].children) {
                child.destroy();
            }
        }

        player.health = 100
        player.maxHealth = player.health;
        target.health = 100
        target.maxHealth = target.health;

        this.objects["player-health-bar"].fills[0].size.x = 300;
        this.objects["target-health-bar"].fills[0].size.x = 300;

        this.objects["battle-bg"].setVisible(true);
        this.objects["attbg"].setVisible(true);
        this.objects["mainactionpanel"].setVisible(true);
        this.objects["actions"].setVisible(true);
        this.objects["infopanel"].setVisible(true);
        this.objects["infotext"].setText("What will you do?", { ...this.engine.defaultFontOptions, size: 28 });

        player.setVisible(true);
        target.setVisible(true);

        const movePlayer = (self, delta, time) => {
            if (self.position.x < 375) {
                self.position.x += 1500 * delta;
            } else {
                self.removeFromUpdateBind(movePlayer);
                this.objects["player-health-bg"].setVisible(true);
                this.objects["player-health-bar"].setVisible(true);
                this.objects["player-name"].setText(player.pokemon.toUpperCase(), { ...this.engine.defaultFontOptions, size: 16 })
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
                this.objects["target-name"].setText(target.pokemon.toUpperCase(), { ...this.engine.defaultFontOptions, size: 16 })
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

        if (!this.engine.physics.objects.includes(player)) 
        {
            this.engine.addObject(player);
        }
        if (!this.engine.physics.objects.includes(target))
        {
            this.engine.addObject(target);
        }

        const attacks = this.createAttacks(player.attackSet);
        this.objects["attacks"] = attacks;

        const endBattle = () => {
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

        const handleTargetDead = () => {
            this.objects["infotext"].setText(`${target.pokemon.toUpperCase()} fainted!`, { ...this.engine.defaultFontOptions, size: 28 });
            setTimeout(() => {
                endBattle();
            }, 2000);
        }

        for (let attackName in player.attackSet) {
            const attackData = player.attackSet[attackName];
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

                    if (attackName === "Scratch" || attackName === "Tackle") {
                        player.position.x += 30;

                        setTimeout(() => {
                            player.position.x -= 30;
                            this.engine.sound.playSFX("hit");

                            const damage = attackData.base_power;
                            target.health = (Math.max(0, target.health - damage));

                            const fullBarWidth = 300;
                            const healthRatio = target.health / target.maxHealth;
                            const newBarWidth = fullBarWidth * healthRatio;

                            this.objects["target-health-bar"].fills[0].size.x = newBarWidth;

                            this.objects["infotext"].setText(`${player.pokemon.toUpperCase()} used ${attackName}!`, { ...this.engine.defaultFontOptions, size: 28 });

                            if (target.health <= 0) {
                                handleTargetDead();
                            }
                            else {
                                setTimeout(() => {
                                    enemyAttack();
                                }, 1500);
                            }
                        }, 200)
                        
                    }

                    else if (attackName === "Fireball") {
                        (async () => {
                            const asset = await createAsset("./assets/moves/fireball-sprite-sheet.png");
                            const fireball = new GameObject()
                                .setName("fireball")
                                .setSprite(asset, Vector2(32, 46))
                                .setScale(Vector2(3, 3))
                                .setPosition(Vector2(player.position.x + 50, player.position.y - 20))
                                .setLayer(4)
                                .setUseCamera(false);

                            this.engine.addObject(fireball);

                            let flyFrame = 0
                            let flyTimer = 0
                            let isImpacting = false;
                            let impactFrame = 2;
                            let impactTimer = 0;

                            const moveFireball = (fbself, delta, time) => {
                                if (!isImpacting) {
                                    fbself.position.x += 1800 * delta;
                                    fbself.position.y -= 420 * delta;
                                
                                    flyTimer += delta;

                                    if (flyTimer >= 0.04) {
                                        flyFrame = (flyFrame + 1) % 2;
                                        fbself.sprite.setCurrentFrame([flyFrame, 0]);
                                        flyTimer = 0;
                                    }

                                    if (fbself.position.x >= target.position.x) {
                                        isImpacting = true;
                                        fbself.sprite.setCurrentFrame([impactFrame, 0]);
                                        this.engine.sound.playSFX("hit");
                                    }

                                } else {
                                    impactTimer += delta;
                                        if (impactTimer >= 0.035) {
                                            impactTimer = 0
                                            impactFrame++;

                                        if (impactFrame > 5) {
                                            fbself.removeFromUpdateBind(moveFireball);
                                            fbself.destroy();

                                            let damage = attackData.base_power;
                                            
                                            let effectMsg = "";
                                            const targetName = target.pokemon.toLowerCase();

                                            if (targetName === "bulbasaur") {
                                                damage = Math.round(damage * 2);
                                                effectMsg = " It's super effective!";
                                            } else if (targetName === "squirtle") {
                                                damage = Math.round(damage * 0.5);
                                                effectMsg = " It's not very effective...";
                                            }
                                            
                                            target.health = (Math.max(0, target.health - damage));
                                            
                                            const fullBarWidth = 300;
                                            const healthRatio = target.health / target.maxHealth;
                                            const newBarWidth = fullBarWidth * healthRatio;

                                            this.objects["target-health-bar"].fills[0].size.x = newBarWidth;

                                            this.objects["infotext"].setText(`${player.pokemon.toUpperCase()} used ${attackName}!`, { ...this.engine.defaultFontOptions, size: 28 });
                                            
                                            if (effectMsg) {
                                                setTimeout(() => {
                                                        this.objects["infotext"].setText(effectMsg, { ...this.engine.defaultFontOptions, size: 28 });
                                                }, 1000);
                                            }

                                            const delay = effectMsg ? 2000 : 1000;
                                            
                                            if (target.health <= 0) {
                                                setTimeout(() => {
                                                    handleTargetDead();
                                                }, effectMsg ? 3000 : 2000);
                                            }
                                            else {
                                                setTimeout(() => {
                                                    enemyAttack();
                                                }, delay);
                                            }
                                    
                                            
                                        } else{
                                            fbself.sprite.setCurrentFrame([impactFrame, 0]);
                                        }
                                    }
                                }
                            };

                            fireball.bindToUpdate(moveFireball);
                            
                        })();
                    }
                }

            };

            attackBtn.bindToUpdate(onAttackBtnUpdate);
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

        const enemyAttack = () => {
            const attackNames = Object.keys(target.attackSet);
            const randomAttackName = attackNames[Math.floor(Math.random() * attackNames.length)];
            const attackData = target.attackSet[randomAttackName];

            this.objects["infotext"].setText(`${target.pokemon.toUpperCase()} used ${randomAttackName}!`, { ...this.engine.defaultFontOptions, size: 28 });

            const applyPlayerDamage = () => {
                this.engine.sound.playSFX("hit");

                let damage = attackData.base_power;
                let effectMsg = "";


                if (randomAttackName === "Seed Shot") {
                    damage = Math.max(1, Math.round(damage * 0.5));
                    effectMsg = " It's not very effective...";
                }
                else if (randomAttackName === "Bubble Gun") {
                    damage = Math.round(damage * 2);
                    effectMsg = " It's super effective!";
                }
                
                player.health = (Math.max(0, player.health - damage));
                
                const fullBarWidth = 300;
                const healthRatio = player.health / player.maxHealth;
                const newBarWidth = fullBarWidth * healthRatio;

                this.objects["player-health-bar"].fills[0].size.x = newBarWidth;

                if (effectMsg) {
                    setTimeout(() => {
                        this.objects["infotext"].setText(effectMsg, { ...this.engine.defaultFontOptions, size: 28 });

                        setTimeout(() => {
                            if (player.health <= 0) {
                                this.objects["infotext"].setText(`${player.pokemon.toUpperCase()} fainted!`, { ...this.engine.defaultFontOptions, size: 28 });
                                setTimeout(() => {
                                    endBattle();
                                }, 1500);
                            } else {
                                this.objects["infotext"].setText("What will you do?", { ...this.engine.defaultFontOptions, size: 28 });
                                this.objects["actions"].setVisible(true);
                            }
                        }, 1000);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        if (player.health <= 0) {
                            this.objects["infotext"].setText(`${player.pokemon.toUpperCase()} fainted!`, { ...this.engine.defaultFontOptions, size: 28 });
                            setTimeout(() => {
                                endBattle();
                            }, 1500);
                        } else {
                            this.objects["infotext"].setText("What will you do?", { ...this.engine.defaultFontOptions, size: 28 });
                            this.objects["actions"].setVisible(true);
                        }

                    }, 1000);
                }
            }

            if (randomAttackName === "Tackle" || !attackData.sheet)
            {
                target.position.x -= 30;

                setTimeout(() => {
                    target.position.x += 30;
                    applyPlayerDamage();
                }, 200);
            }
            else {
                (async () => {
                    const asset = await createAsset(attackData.sheet);
                    const moveSprite = new GameObject()
                        .setName("move-sprite")
                        .setSprite(asset, Vector2(32, 32))
                        .setScale(Vector2(3, 3))
                        .setPosition(Vector2(target.position.x - 50, target.position.y - 20))
                        .setLayer(4)
                        .setUseCamera(false);

                    this.engine.addObject(moveSprite);

                    const moveSpriteAnimation = (pself, delta, time) => {
                        pself.position.x -= 1800 * delta;
                        pself.position.y += 720 * delta;

                        if (pself.position.x <= player.position.x + 50) {
                            pself.removeFromUpdateBind(moveSpriteAnimation);
                            pself.destroy();
                            applyPlayerDamage();
                        }
                    };

                    moveSprite.bindToUpdate(moveSpriteAnimation);
                })();
            }

        };

        const fleeButtonBind = (self, delta, time) => {
            if (this.engine.state != "battle") {
                self.removeFromUpdateBind(fleeButtonBind);
                return;
            }

            if (self.custom_attributes["clicked"]) {
                self.custom_attributes["clicked"] = false;
                this.objects["infotext"].setText("You fled the battle!", { ...this.engine.defaultFontOptions, size: 28 });
                setTimeout(() => { endBattle(); }, 1500);
            }
        }

        this.objects["flee-btn"].bindToUpdate(fleeButtonBind);
    }
}
