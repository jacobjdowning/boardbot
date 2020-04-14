module.exports = {
    "name": "team",
    "onlygame": "avalon",
    "execute": (msg, args, table) =>{
        if(msg.channel.type == "dm"){
            msg.reply("Team proposals should be public please enter this "+
            "in a public chat channel");
            return;
        }
        if (args.length != table.game.currMissionCount){
            msg.reply("There in an incorrect number of members on this team, "+
                    `there should be ${table.game.currMissionCount}.`);
            return;
        }
        if (table.game.currLeader.id != msg.author.id){
            msg.reply("Only team leaders can propse a team");
            return;
        }
        if (table.game.voteState != "none"){
            msg.reply("There is another vote going on right now");
            return;
        }
        
        //somewhere check that there isn't already a team being voted on

        let players = table.game.players;
        let team = [];
        let error = false;
        args.forEach(teammate => {
           for (let i = 0; i < players.length; i++) {
                if (players[i].name == teammate){
                      team.push(players.splice(i,1).shift());
                      return;              
                }
           }
           msg.reply(`${teammate} is not in the game, please try again`);
           error = true;
        });
        if (error) return;
        
        const cache = msg.client.users.cache;
        const allPlayers = table.game.players;

        let teamString = "";
        team.forEach((teammember, i) => {
            teamString = teamString + (i?", ": "") + teammember.name; 
        });
        table.game.setProposedTeam(team);
        table.game.responseChannel = msg.channel.id;

        allPlayers.forEach(player => { 
            cache.get(player.id).send(
                `The proposed team is ${teamString}. `+
                "Respond with !pass or !fail. "+
                "This response will be public."
            );
        });
    }
}