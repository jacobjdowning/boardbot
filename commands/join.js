module.exports = {
    "name": "join",
    "execute": (msg, args, table) =>{
        if(table.addPlayer(msg.author.id, msg.author.username, args[0])){
            msg.reply("Added Player");
        }else{
            msg.reply("you are currently sitting at a different table\n" +
            "Please run !remove to leave your current table before joining "+
            "this one");
        }
    }
}