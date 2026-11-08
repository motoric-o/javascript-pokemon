import GameObject from "../../lib/engine/object.js";
import { Vector2 } from "../../lib/graphics/primitive/index.js";
import { createAsset, getFrame } from "../../lib/util/graphics.js";

export default class Pokemon extends GameObject {
    constructor() {
        super();

        this.nick = null;
        this.health = null;
        this.attack = null;
        this.defense = null;
        this.speed = null;
        this.status = "normal";
        this.attackSet = null;
    }

    static async create(pokemonName) {
        const res = await fetch(`./assets/pokemon_datas/${pokemonName}.json`);
        const data = await res.json();

        const data_stats = data["base_stats"];
        const data_sprite = data["sprite"];
        const data_attack = data["attacks"];

        const spriteAsset = await createAsset(data_sprite["sheet"]);

        const pokemon = new Pokemon()
            .setNick(pokemonName)
            .setSprite(spriteAsset, Vector2(data_sprite["frameDimX"], data_sprite["frameDimY"]))
            .setHealth(data_stats["health"])
            .setAttack(data_stats["attack"])
            .setDefense(data_stats["defense"])
            .setSpeed(data_stats["speed"])
            .setAttackSet(data_attack);

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

    setAttack(attack) {
        this.attack = attack;
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

    attack(target) {

    }

    hurt() {

    }
}