const CodeNames = require('../games/codenames.js');
module.exports = {
    "name": "codenames",
    "execute": (message, args, table) => {
        if (message.channel.type == 'text'){
            table.game = new CodeNames();
            table.teams.forEach((players,team,m) => {
                players.forEach(player => {
                    const user = message.client.users.cache.get(player.id);
                    user.send(table.game.presentKeyCard());
                });
            });
        }
        message.reply("Codename keycards sent");
    }
}