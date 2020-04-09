const Resistance = require('../games/resistance.js');

module.exports = {
    "name": "avalon",
    "onlyGame": "resistance",
    "execute": (msg, args, table) => {
        table.game = new Resistance(table);
        const cache = msg.client.users.cache;
        const players = table.game.players;
        const evils = players.filter((player) =>{
            return player.alignment == "evil";
        });
        players.forEach(player => {
            if (player.special == "merlin") {
                let evilString = "";
                evils.forEach((evil, i) => {
                    evilString = evilString + (i?", ": "") + evil.name; 
                });
                cache.get(player.id).send(
                    "You are Merlin! The evil players are " +
                    evilString +
                    ". Make sure not to let them know who you are!"
                );
            }else if (player.alignment == "evil"){
                let evilString = "";
                evils.filter(evil =>{
                    return evil.id != player.id
                })              
                .forEach((evil, i) => {
                    evilString = evilString + (i?", ": "") + evil.name; 
                });
                cache.get(player.id).send(
                    "You are an evil follower of Mordred!"+
                    " Your co-conspirators are " +
                    evilString
                );
            }else if (player.alignment == "good"){
                cache.get(player.id).send(
                    "You are good and loyal servant of King Arthur. "+
                    "Weed out the evil in your midst."
                 );
            }
        });
    }
}