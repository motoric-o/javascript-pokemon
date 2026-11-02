import GameObject from "../lib/engine/object.js";
import { Color, Vector2 } from "../lib/graphics/primitive/index.js";
import { createFillInfo } from "../lib/util/graphics.js";

export default function Button(text, engine, options = {}) {
    const fontOptions = engine.defaultFontOptions;
    const defaultOptions = { size: Vector2(200, 50), color: Color(0, 0, 0), fillColor: Color(150, 150, 150) };
    const option = { ...defaultOptions, ...options };

    const button = new GameObject()
        .setName("button")
        .setVertices([
            Vector2(-option.size.x / 2, -option.size.y / 2),
            Vector2(option.size.x / 2, -option.size.y / 2),
            Vector2(option.size.x / 2, option.size.y / 2),
            Vector2(-option.size.x / 2, option.size.y / 2)
        ])
        .setLayer(2)
        .setUseCamera(false)
        .setColor(option.color)
        .addAttribute("isButton", true)
        .addAttribute("hovered", false)
        .addAttribute("clicked", false)
        .setFills([
            createFillInfo("R", [option.fillColor], Vector2(-option.size.x / 2 + 1, -option.size.y / 2 + 1), Vector2(option.size.x - 1, option.size.y - 1))
        ]);

    const buttonText = new GameObject()
        .setName("button-text")
        .setText(text, fontOptions)
        .setLocalPosition(Vector2(0, 7))
        .setLayer(2)
        .setUseCamera(false);

    button.addChild(buttonText);

    button.bindOnCollision((self, hit) => {
        if (hit.name == "cursor") {
            self.custom_attributes["hovered"] = true;
        }
    });

    button.bindOnCollisionEnded((self, hit) => {
        if (hit.name == "cursor") {
            self.custom_attributes["hovered"] = false;
        }
    });

    button.bindToUpdate((self, delta, time) => {
        if (self.custom_attributes["hovered"]) {
            self.fills[0].colors[0] = Color(100, 100, 100);
        } else {
            self.fills[0].colors[0] = option.fillColor;
        }

        if (self.custom_attributes["hovered"] && engine.input.isMousePressed(0)) {
            self.custom_attributes["clicked"] = true;
        } else if (self.custom_attributes["hovered"] && engine.input.isMouseReleased(0)) {
            self.custom_attributes["clicked"] = false;
        }
    });

    return button;
}