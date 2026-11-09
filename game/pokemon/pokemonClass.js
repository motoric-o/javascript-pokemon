import GameObject from "../../lib/engine/object.js";
import { Vector2 } from "../../lib/graphics/primitive/index.js";
import { createAnimation, createAsset, getFrame } from "../../lib/util/graphics.js";

export default class Pokemon extends GameObject {
    constructor(pokemonName) {
        super();

        this.nick = null;
        this.pokemon = pokemonName;
        this.health = null;
        this.maxHealth = null;
        this.attackStat = null;
        this.defense = null;
        this.speed = null;
        this.status = "normal";
        this.class = null;
        this.attackSet = null;
        this.attackAssets = {};
    }

    static async create(pokemonName) {
        const res = await fetch(`./assets/pokemon_datas/${pokemonName}.json`);
        const data = await res.json();

        const data_stats = data["base_stats"];
        const data_sprite = data["sprite"];
        const data_attack = data["attacks"];

        const spriteAsset = await createAsset(data_sprite["sheet"]);

        const pokemon = new Pokemon(pokemonName)
            .setNick(pokemonName)
            .setSprite(spriteAsset, Vector2(data_sprite["frameDimX"], data_sprite["frameDimY"]))
            .setScale(Vector2(data_sprite["spriteScale"], data_sprite["spriteScale"]))
            .setHealth(data_stats["health"])
            .setMaxHealth(data_stats["health"])
            .setAttackStat(data_stats["attack"])
            .setDefense(data_stats["defense"])
            .setSpeed(data_stats["speed"])
            .setClass(data_stats["class"])
            .setLayer(2)
            .setUseCamera(false)
            .setAttackSet(data_attack);


        for (let [key, value] of Object.entries(data_attack)) {
            if (value["type"] == "Normal" || !value["sheet"]) {
                continue;
            }

            const asset = await createAsset(value["sheet"]);
            pokemon.attackAssets[key] = asset;
        }

        return pokemon;
    }

    setNick(nick) {
        this.nick = nick;
        this.setName(nick);
        return this;
    }

    setHealth(health) {
        this.health = health;
        return this;
    }

    setMaxHealth(max) {
        this.maxHealth = max;
        return this;
    }

    setAttackStat(attack) {
        this.attackStat = attack;
        return this;
    }

    setDefense(defense) {
        this.defense = defense;
        return this;
    }

    setSpeed(speed) {
        this.speed = speed;
        return this;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }

    setAttackSet(set) {
        this.attackSet = set;
        return this;
    }

    setClass(classStat) {
        this.class = classStat;
        return this;
    }

    initBattle() {
        this.health = this.maxHealth;
    }

    getHealthRatio() {
        return this.health / this.maxHealth;
    }

    isFainted() {
        return this.health <= 0;
    }

    calculateDamage(attacker, attackName) {
        let dmg = attacker.attackSet[attackName]["base_power"];
        const type = attacker.attackSet[attackName]["type"];
        let effectKey = "hit";

        if (this.class == "Fire") {
            if (type == "Water") {
                dmg *= 2;
                effectKey = "super_effective";
            }
        } else if (this.class == "Earth") {
            if (type == "Fire") {
                dmg *= 2;
                effectKey = "super_effective";
            }
        } else if (this.class == "Water") {
            if (type == "Fire") {
                dmg /= 2;
                effectKey = "not_effective";
            }
        }

        return { damage: dmg, effectKey: effectKey };
    }

    attack(attackName, target, engine, { onHit, onComplete }) {
        const dir = target.position.x > this.position.x ? 1 : -1;

        if (this.attackSet[attackName]["type"] == "Normal") {
            const offset = dir * 30;

            this.position.x += offset;

            setTimeout(() => {
                this.position.x -= offset;
                engine.sound.playSFX("hit");

                if (onHit) {
                    onHit();
                }
            }, 200);

            setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 300);
        } else {
            const attackData = this.attackSet[attackName]

            const attObj = new GameObject()
                .setName(attackName)
                .setSprite(this.attackAssets[attackName], Vector2(attackData["frameDimX"], attackData["frameDimY"]))
                .setLayer(4)
                .setScale(Vector2(3, 3))
                .setUseCamera(false);

            const loopAnim = createAnimation("loop", this.attackSet[attackName]["loop_sequence"], this.attackSet[attackName]["animDirection"], this.attackSet[attackName]["animFrameRate"]);
            const impactAnim = createAnimation("impact", this.attackSet[attackName]["impact_sequence"], this.attackSet[attackName]["animDirection"], this.attackSet[attackName]["animFrameRate"]);
            
            attObj.sprite.addAnimation(loopAnim);
            attObj.sprite.addAnimation(impactAnim);
            attObj.sprite.setAnimation("loop");

            if (dir == 1) {
                attObj.setPosition(Vector2(this.position.x + 50, this.position.y - 20));
            } else {
                attObj.setPosition(Vector2(this.position.x - 50, this.position.y - 20));
            }

            engine.addObject(attObj);

            const projDirX = target.position.x - attObj.position.x;
            const projDirY = target.position.y - attObj.position.y;

            const T = Math.abs(projDirX) / 1800;

            attObj.setVelocity(Vector2(projDirX / T, projDirY / T));

            let isImpacting = false;

            const impactUpdate = (self, delta, time) => {
                if (!isImpacting && ((dir == 1 && self.position.x >= target.position.x) || (dir == -1 && self.position.x <= target.position.x))) {
                    self.setVelocity(Vector2(0, 0));
                    isImpacting = true;
                    engine.sound.playSFX("hit");
                    self.sprite.setAnimation("impact");

                    if (onHit) {
                        onHit();
                    }

                    const animDuration = (self.sprite.animations[self.sprite.currentAnimation].sequence.length / self.sprite.animations[self.sprite.currentAnimation].framerate) * 1000;

                    setTimeout(() => {
                        self.removeFromUpdateBind(impactUpdate);
                        self.destroy();
    
                        if (onComplete) {
                            onComplete();
                        }
                    }, animDuration);
                }
            }

            attObj.bindToUpdate(impactUpdate);
        }
    }

    hurt(damage) {
        this.health = Math.max(this.health - damage, 0);
        
        return this.isFainted();
    }
}