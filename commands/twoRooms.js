const teamEmojis = {
    "red":":red_square:",
    "blue":":blue_square:",
    "gray":":white_large_square:"
}
const TwoRooms = require('../games/twoRooms.js');


module.exports = {
    "name": "tworooms",
    "execute": (msg, args, table) =>{
        if (msg.channel.type != 'text'){
            msg.reply("Games must be started in a Guild Text Channel");
            return;
        }
        if(!TwoRooms.validateOptions(args)){
            msg.reply("Some of these options are not available");
            return;             
        }
        table.game = new TwoRooms(table, args);
        const cache = msg.client.users.cache
        table.game.players.forEach(player => {
            cache.get(player.id).send(
                `
                Role: ${player.role.name}
                Team: ${teamEmojis[player.role.team]}
                Starting Status: ${player.role.status}
                Description: ${player.role.description}
                You start in Room ${player.start}
                `
            )
        });
    }
}