module.exports = {
    "name": "clear",
    "execute": (message, args, table) => {
        table.clearPlayers();
        message.reply("cleared teams");
    }
}