export default class Dialogue {
    constructor() {
        this.dialogues = {
            "attack": {
                "use": "{name} used {attack}!",
                "hit": "It's effective!",
                "critical": "A critical hit!",
                "super_effective": "It's super effective!",
                "not_effective": "It's not very effective...",
                "immune": "It doesn't affect {name}"
            },
            "status": {
                "faint": "{name} has fainted!",
                "poison": {
                    "inflict": "{name} was poisoned!",
                    "damage_tick": "{name} is hurt by poison!"
                },
                "burn": {
                    "inflict": "{name} was burned!",
                    "damage_tick": "{name} is hurt by its burn!"
                },
                "freeze": {
                    "inflict": "{name} was frozen solid!",
                    "damage_tick": "{name} thawed out!"
                },
            },
            "battle": {
                "encounter": "A wild {name} appeared!",
                "send_out": "Go! {name}!",
                "flee_success": "Got away safely!",
                "flee_fail": "Can't escape!",
                "question": "It's {name}'s turn"
            }
        }
    }

    get(category, action, params = {}) {
        if (!this.dialogues[category] || !this.dialogues[category][action]) {
            return "";
        }

        let raw = this.dialogues[category][action];

        for (let [key, value] of Object.entries(params)) {
            raw = raw.replaceAll(`{${key}}`, value);
        }

        return raw;
    }
}