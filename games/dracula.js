const roles = require('../assets/draculaRoles.json');
const { shuffle } = require('../utility.js');

class Dracula {
    constructor(table, options){
        if (!options.some(opt=> opt.toLowerCase() == "dracula")){
            options.push("dracula");
        }
        let characters = roles.filter(role =>
            options.some(option =>
                role.name.toLowerCase() == option
            )
        );

        const numPlayers = table.teams.get("unteamed").length
        if (numPlayers+1 > characters.length){
            const fillCharacters = roles.filter(role =>
                !options.some(option =>
                    role.name.toLowerCase() == option    
                )
            );
            
            const tackOns = shuffle(fillCharacters)
                .slice(0, numPlayers+1-characters.length);
            characters = characters.concat(tackOns);
        }

        const drac = characters.shift();
        if (drac.name.toLowerCase() != "dracula"){
            console.error("Dracula is no the first in " +
            "characters, check draculaRols.json");
        }

        characters = shuffle(characters);
        this.mysteryGuest = characters.shift();

        characters.unshift(drac);
        characters = shuffle(characters);

        this.players = characters.map((char, i)=>
            [table.teams.get("unteamed")[i], char]
        )

        // console.log(this.players);
        // console.log("Mystery Guest", this.mysteryGuest);

    }

    static validateOptions(options){
        return options.reduce((valid, option) =>
            valid && roles.some(role =>
                role.name.toLowerCase() == option.toLowerCase()
            )
        , true);
    }
}

module.exports = Dracula;