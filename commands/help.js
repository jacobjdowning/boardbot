module.exports = {
    "name": "help",
    "desc": "Prints this message",
    "execute": (msg, args, table) =>{
        const { commands } = msg.client;

        const reply = commands.reduce((out, cur) => {
            const description = cur.desc?`: ${cur.desc}`:'';
            return `${out} !${cur.name}${description}\n`
        }, 'Available commands are:\n')

        msg.reply(reply)
    }
}