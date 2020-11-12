module.exports = {
    "name": "help",
    "execute": (msg, args, table) =>{
        const { commands } = msg.client;

        const reply = commands.reduce((out, curr) => (
            out + " !" + curr.name + "\n"
        ), 'Available commands are:')

        msg.reply(reply)
    }
}