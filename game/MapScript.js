import GameObject from "./../lib/engine/object.js";
import { Color } from "./../lib/graphics/primitive/color.js";
import { Vector2 } from "./../lib/graphics/primitive/vector2.js";
import {createAsset} from "../../lib/util/graphics.js";
import GameScript from "./GameScript.js";


export default class MapScript extends GameScript {
    constructor(engine) {
        super(engine);
    }

    async loadAssets() {
        // Map Loading
        const mapAsset = await createAsset('./../assets/map/Map.png');

        const map = new GameObject()
            .setName("map")
            .setSprite(mapAsset)
            .addToCollisionLayerBlacklist(2)
            .setLayer(0)
            .addAttribute("canMove", false)
            .setPosition(Vector2(1000, 1000))
            .setScale(Vector2(5, 5));
        this.objects["map"] = map;
        this.engine.addObject(map);
    }
}