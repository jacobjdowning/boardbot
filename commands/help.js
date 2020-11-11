module.exports = {
    "name": "help",
    "execute": (msg, args, table) =>{
        const { commands } = msg.client;
        
        const reply = Array.from(commands.keys).reduce((out, curr) => (
            out + " " + curr
        ), '')

        console.log('reply:', reply)

        msg.reply(reply)
    }
}