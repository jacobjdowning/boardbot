//TODO: consolidate into one decrypto command with arguments
module.exports = {
    "name": "decwords",
    "onlyGame": "decrypto",
    "execute": (msg, args, table) => {
        if(msg.channel.type != 'dm'){
            msg.reply("This code is only usable in DM, it's secret!:spy:");
            return;
        }
        msg.reply(table.game.sendBoard(msg.author.id));
    }
}