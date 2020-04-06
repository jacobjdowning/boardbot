module.exports = {
    "name": "decround",
    "onlyGame": "decrypto",
    "execute": (msg, args, table) => {
        let messages = table.game.startRound();
        if(typeof(messages) == 'string'){
            msg.reply(messages);
            return;
        }
        msg.reply(messages.shift().content);
        let usersCache = msg.client.users.cache
        messages.forEach(message =>{
            usersCache.get(message.id).send(message.content);
        })
    }
}