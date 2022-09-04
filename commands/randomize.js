const { shuffle } = require('../utility.js');
module.exports = {
    "name": "randomize",
    "execute": (message, args, table) => {
        let allPlayers = [];
        for(const entry of table.teams.entries()){
            allPlayers = allPlayers.concat(entry[1]);
        }
        table.clearPlayers();
        allPlayers = shuffle(allPlayers);
        for (const player of allPlayers) {
            const team = args.shift();
            table.addPlayer(player.id, player.name, team);
            args.push(team);
        }
    }
}