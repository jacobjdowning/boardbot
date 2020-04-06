module.exports = {
    "name": "join",
    "execute": (msg, args, table) =>{
        table.addPlayer(msg.author.id, msg.author.username, args[0]);
        msg.reply("Added Player");
    }
}