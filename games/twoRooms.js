const roleCards = require('../assets/trRoleCards.json');
const { shuffle } = require('../utility.js')


class TwoRooms{
    constructor(table, options){
        this.deck = [];
        for (const role in roleCards.base) {
            if (roleCards.base.hasOwnProperty(role)) {
                this.deck.push({"name":role, ...roleCards.base[role]});
            }
        }
        if(options){
            options.forEach(option => {
                for (const role in roleCards[option]) {
                    if (roleCards[option].hasOwnProperty(role)) {
                        this.deck.push({
                            "name":role,
                            ...roleCards[option][role]
                        });
                    }
                }
            });
            if(options.includes("bury") && options.includes("helpers")){
                for (const role in roleCards.bury_helpers) {
                    if (roleCards.bury_helpers.hasOwnProperty(role)) {
                        this.deck.push({
                            "name":role,
                            ...roleCards.bury_helpers[role]
                        });
                    }
                }
            }
        }
        
        this._fillRoles(table, options && options.includes("bury"));
        this.deck = shuffle(this.deck);
        this.burried = options && options.includes("bury")?this.deck.pop():null;
        console.log(this.burried);
        this.players = table.teams.get("unteamed").map((player, i) =>{
            return { 
                id : player.id,
                role : this.deck.pop(),
                start : i<table.teams.get("unteamed").length/2 ? "A" : "B"
            }
        });
        this.players = shuffle(this.players);
    }

    _fillRoles(table, bury){
        const toFill = table.teams.get("unteamed").length -
            this.deck.length +
            (bury?1:0);

        if(toFill == 0){
            return;
        }

        const blueIsBigger = Math.random() > 0.5;
        const blueCount = toFill/2.0 + (toFill%2==1?0.5:0) * (blueIsBigger?1:-1)
        for (let i = 0; i < blueCount; i++) {
            this.deck.push({"name":"Blue", ...roleCards.fill.Blue});
        }
        const redCount = toFill/2.0 + (toFill%2==1?0.5:0) * (blueIsBigger?-1:1)
        for (let i = 0; i < redCount; i++) {
            this.deck.push({"name":"Red", ...roleCards.fill.Red});
        }
    }

    static validateOptions(options){
        for (const option of options) {
            if (roleCards[option] == null){
                return false;
            }
        }
        return true;
    }
}

module.exports = TwoRooms;