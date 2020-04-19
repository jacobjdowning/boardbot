const Resistance = require('../games/resistance.js');

module.exports = {
    "name": "avalon",
    "onlyGame": "resistance",
    "execute": (msg, args, table) => {
        if(msg.channel.type == "dm"){
            msg.reply("Games have to start in a Server Text Channels");
            return;
        }
        table.game = new Resistance(table);
        // TODO: vvvv check if available first for outages also set at a diffferect time for multiple tables
        table.guild = msg.channel.guild;
        const cache = msg.client.users.cache;
        const players = table.game.players;
        

        // Inform Players of their roles
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

        //Start first round
        let leader = table.game.nextLeader;//Move to common?
        cache.get(leader.id).send(
            "You have been chosen to lead the next mission. "+
            "Propose your team with command \"!team\" followed by "+
            "the usernames of the team members you want to go on the mission. "+
            `The next mission requires ${table.game.currMissionCount} team members` 
        )
    }
}