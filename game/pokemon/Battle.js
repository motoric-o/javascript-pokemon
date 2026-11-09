import GameObject from "../../lib/engine/object.js";
import { Vector2 } from "../../lib/graphics/primitive/vector2.js";
import { createAsset } from "../../lib/util/graphics.js";
import GameScript from "../GameScript.js";
import Pokemon from "./pokemonClass.js";

export default class Battle extends GameScript {
    constructor(engine) {
        super(engine);

        this.pokemons = [];
    }

    async loadAssets() {
        const bgasset = await createAsset("./assets/misc/battle_background_reference.png");

        const bg = new GameObject()
            .setName("battle-bg")
            .setSprite(bgasset)
            .setLayer(2)
            .setVisible(false)
            .setUseCamera(false)
            .setPosition(Vector2(1280/2, 720/2))
            .setScale(Vector2(1.25, 1.25));

        const charmander = await Pokemon.create("charmander");
        const bulbasaur = await Pokemon.create("bulbasaur");
        const squirtle = await Pokemon.create("squirtle");

        this.pokemons.push(charmander);
        this.pokemons.push(bulbasaur);
        this.pokemons.push(squirtle);

        this.engine.addObject(bg);
        this.objects["battle-bg"] = bg;
    }

    start(player, target) {
        this.objects["battle-bg"].setVisible(true);

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


        // Temporary Battle Cycle Break

        // setTimeout(() => {
        //     this.engine.setState("roam")
        //     this.objects["battle-bg"].setVisible(false);
        // }, 2000)
    }
}