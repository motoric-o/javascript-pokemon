import GameObject from "../lib/engine/object.js";
import GameScript from "./GameScript.js"

export default class GameSounds extends GameScript {
    constructor(engine, player) {
        super(engine);
        this.objects["player"] = player;
    }

    async loadAssets() {
        this.engine.sound.loadSound("bgm-map", "../assets/sound/map.wav");
        this.engine.sound.loadSound("bgm-battle", "../assets/sound/battle.mp3");
        this.engine.sound.loadSound("hit", "../assets/sound/tackleHit.wav");
        this.engine.sound.loadSound("encounter", "../assets/sound/initBattle.wav");

        const update = new GameObject()
            .setName("audio-manager")
            .setLayer(0)
            .setVisible(false);

        this.engine.addObject(update);
        this.objects["audio-update"] = update;

        update.addAttribute("encounter", false);
        update.addAttribute("bgm-map", false);
        update.addAttribute("bgm-battle", false);
    }

    start() {
        const audioUpdate = this.objects["audio-update"];
        const debounces = audioUpdate.custom_attributes;

        audioUpdate.bindToUpdate((self, delta, time) => {
            if ((this.engine.state == "menu" || this.engine.state == "roam") && !debounces["bgm-map"]) {
                this.engine.sound.stopMusic();
                this.engine.sound.playMusic("bgm-map", true);
                debounces["bgm-map"] = true;
                debounces["bgm-battle"] = false;
            } else if (this.engine.state == "battle" && !debounces["bgm-battle"]) {
                this.engine.sound.stopMusic();
                this.engine.sound.playMusic("bgm-battle");
                debounces["bgm-map"] = false;
                debounces["bgm-battle"] = true;
            }

            if (this.engine.state == "encountering" && !debounces["encounter"]) {
                this.engine.sound.stopMusic();
                const sfx = this.engine.sound.playSFX("encounter");
                debounces["encounter"] = true;
                debounces["bgm-battle"] = false;

                sfx.addEventListener("ended", (e) => {
                    debounces["encounter"] = false;
                });
            }
        });
    }
}