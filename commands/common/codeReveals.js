module.exports = (team,msg,table) => {
    if(msg.channel.type != "text"){
        msg.reply("This command can only be used in at text channel,"+
                    "everyone needs to see!");
        return
    }

    msg.channel.send(table.game.revealCode(team));
}