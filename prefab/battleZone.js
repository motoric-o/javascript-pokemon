import GameObject from "../lib/engine/object.js";
import { Color, Vector2 } from "../lib/graphics/primitive/index.js";
import { createFillInfo } from "../lib/util/graphics.js";

export default function BattleZone(size = Vector2(100, 100), position = Vector2(0, 0)) {
    const zone = new GameObject()
        .setName("battleZone")
        .setVertices([
            Vector2(-size.x / 2, -size.y / 2),
            Vector2(size.x / 2, -size.y / 2),
            Vector2(size.x / 2, size.y / 2),
            Vector2(-size.x / 2, size.y / 2),
        ])
        .setPosition(position)
        .addToCollisionLayerBlacklist(0)
        .addToCollisionLayerBlacklist(2)
        .addToCollisionLayerBlacklist(3)
        .setVisible(false)
        .setLayer(0);
        
        
    return zone;
}