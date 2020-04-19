module.exports = {
    "name": "order",
    "gameonly":"avalon",
    "execute": (msg, args, table) =>{
        let output = "";
        table.game.players.forEach(player => {
            output = output + player.name + "\n";
        });
        msg.reply(output);
    }
}