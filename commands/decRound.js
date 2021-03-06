//TODO: consolidate into one decrypto command with arguments
module.exports = {
    "name": "decround",
    "onlyGame": "decrypto",
    "execute": (msg, args, table) => {
        for (let i = 0; i < 2; i++) {
            msg.channel.send(table.game.revealCode(i));
        }
        let messages = table.game.startRound();
        if(typeof(messages) == 'string'){
            msg.reply(messages);
            return;
        }
        msg.channel.send(messages.shift().content);
        let usersCache = msg.client.users.cache
        messages.forEach(message =>{
            usersCache.get(message.id).send(message.content);
        })
    }
}