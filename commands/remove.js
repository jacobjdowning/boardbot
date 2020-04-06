module.exports = {
    "name": "remove",
    "execute": (msg, args, table) => {
        table.removePlayer(msg.author.id);
        msg.reply('Removed player');
    }
}