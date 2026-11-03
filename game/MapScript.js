import GameObject from "./../lib/engine/object.js";
import { Color } from "./../lib/graphics/primitive/color.js";
import { Vector2 } from "./../lib/graphics/primitive/vector2.js";
import { createAsset } from "../../lib/util/graphics.js";
import GameScript from "./GameScript.js";
import BoundBox from "../prefab/boundBox.js";


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
            .setPosition(Vector2(2100, 1290))
            .setScale(Vector2(5, 5));
        this.objects["map"] = map;
        this.engine.addObject(map);

        const collisionMapResponse = await fetch('../assets/map/Map.json');
        const collisionMapJson = await collisionMapResponse.json();

        const collisionMap = collisionMapJson.layers.find(layer => layer.name == "Collisions");
        const height = collisionMap.height;
        const width = collisionMap.width;

        for (let row = 0; row < height - 1; row++) {
            let col = 0;
            while (col < width) {
                const i = row * width + col;

                const tileId = collisionMap.data[i];

                if (tileId == 0) {
                    col++
                    continue;
                }

                const startCol = col;

                while (col < width && collisionMap.data[row * width + col] != 0) {
                    col++;
                }

                const tileCount = col - startCol;
                const boxW = tileCount * 60;
                const boxH = 60;

                const leftX = startCol * 60;
                const centerX = leftX + boxW / 2;
                const centerY = (row * 60) + 30;

                const boundBox = BoundBox(Vector2(boxW, boxH), Vector2(centerX, centerY));
                this.engine.addObject(boundBox)
            }
        }
    }
}