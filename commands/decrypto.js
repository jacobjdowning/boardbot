const Decrypto = require("../games/decrypto.js");
module.exports = {
    "name": "decrypto",
    "execute": (msg, args, table) => {
        if(!(table.teams.has('black') && table.teams.has('white'))){
            msg.reply("There must be one team named black and one team named white to play this game");
            return;
        }
        table.game = new Decrypto(table, args.includes('laser'));
        const userCache = msg.client.users.cache;
        let messages = table.game.startGame();
        messages.forEach(message => {
            userCache.get(message.id).send(message.content);
        });
        messages = table.game.startRound();
        msg.reply(messages.shift().content);
        messages.forEach(message =>{
            userCache.get(message.id).send(message.content);
        })
    }
}