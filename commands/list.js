module.exports = {
    "name": "list",
    "execute": (msg, args, table) =>{
        msg.reply(table.presentMembers());
    }
}