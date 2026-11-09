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
            "battle": {
                "encounter": "A wild {name} appeared!",
                "send_out": "Go! {name}!",
                "flee_success": "Got away safely!",
                "flee_fail": "Can't escape!"
            }
        }
    }

    get(category, action, params = {}) {
        if (!this.dialogues[category] && !this.dialogues[category][action]) {
            return "";
        }

        let raw = this.dialogues[category][action];

        for (let [key, value] of Object.entries(params)) {
            raw = raw.replaceAll(`{${key}}`, value);
        }

        return raw;
    }
}