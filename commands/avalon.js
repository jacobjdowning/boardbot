const Resistance = require('../games/resistance.js');

const inform = {
    "merlin":"You are Merlin! The evil players are MERLINSTRING. "+
        "Make sure not to let them know who you are!",
    "percival":"You are Percival! You sense great power from POWERSTRING",
    "oberon":"You are Oberon! Sow the seeds of choas and help the evil team",
    "mordred":"You are Mordred! As a true traitor to Arthur you are not "+
        "visible to Merlin. Your co-conspiritors are EVILSTRING",
    "morgana":"You are Morgana! Your great power may confuse Percival. "+
        "Your co-conspirators are EVILSTRING",
    "evil":"You are an evil follower of Mordred!"+
        "Your co-conspirators are EVILSTRTING",
    "good":"You are good and loyal servant of King Arthur. "+
        "Weed out the evil in your midst."
}

module.exports = {
    "name": "avalon",
    "onlyGame": "resistance",
    "execute": (msg, args, table) => {
        if(msg.channel.type == "dm"){
            msg.reply("Games have to start in a Server Text Channels");
            return;
        }
        if(!Resistance.validateOptions(args)){
            msg.reply("Some of the characters requested are not available");
            return;
        }
        table.game = new Resistance(table, args);
        // TODO: vvvv check if available first for outages also set at a
        // diffferent time for multiple tables
        table.guild = msg.channel.guild;
        const cache = msg.client.users.cache;
        const players = table.game.players;
        

        // Inform Players of their roles
        const evils = players.filter((player) =>{
            return player.alignment == "evil";
        });

        const merlinString = evils.filter(player=>
                player.special != "mordred"
            ).reduce((output, player) => output + player.name + ' ' ,'');

        const powerString = players.filter(player =>
                player.special == "morgana" || player.special == "merlin"
            ).reduce((output, player) => output + player.name + ' ' ,'');

        players.forEach(player => {
            const evilString = evils.filter(evil => 
                    evil.id != player.id && evil.special != "oberon"
                ).reduce((output, player) => output + player.name + ' ' ,'');
            
            let informString = inform[player.special!=""?
                player.special:
                player.alignment];
            
            informString = informString.replace("MERLINSTRING", merlinString);
            informString = informString.replace("POWERSTRING", powerString);
            informString = informString.replace("EVILSTRING", evilString);
            
            cache.get(player.id).send(informString);
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