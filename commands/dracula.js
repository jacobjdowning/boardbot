const Dracula = require('../games/dracula.js');
const { shuffle } = require('../utility.js');

async function whisperVote(player){
    const channel = player.dmChannel;//might be null!!!
    await channel.send("Did the last accusation accurately guess your character?");
    let collection = await channel.awaitMessages(m => {
        return m.content.includes('no') ||  m.content.includes('yes')
    }, {max:1}); // probably should have a time limit
    return collection.first().content.includes('yes');
}

function zombieNeighbours(table, zombie) {
    const players = table.teams.get('unteamed');
    const zombieIndex = players.findIndex(player => player.id == zombie.id);
    let zombieNeighbourIndex = [zombieIndex + 1, zombieIndex - 1];
    for (let i = 0; i < zombieNeighbourIndex.length; i++) {
        if(zombieNeighbourIndex[i] < 0){
            zombieNeighbourIndex[i] = players.length-1;
        }else if(zombieNeighbourIndex[i] >= players.length){
            zombieNeighbourIndex[i] = 0;
        }
    }
    return zombieNeighbourIndex.map(index => players[index]);
}

module.exports = {
    "name": "dracula",
    "onlyGame": "dracula",
    "execute": (message, args, table) => {
        const userCache = message.client.users.cache

        if(args.some(arg => arg.toLowerCase() == "jekswap")){
            const jekyll = table.game.players.filter(player =>
                    player[0].id = message.author.id
                )

            if (jekyll[1].name != "Doctor Jekyll"){
                message.reply("only Doctor Jekyll can reveal themselves");
                return;
            }

            //Swap Jekyll
            const tempJek = jekyll[1];
            jekyll[1] = table.game.mysteryGuest;
            table.game.mysteryGuest = tempJek;

            userCache.get(player[0].id).send(
                `You are now the character ${jekyll[1].name}\n${jekyll[1].desc}`
            )

            return;
        }
        if(args.some(arg => arg.toLowerCase() == "accuse")){
            const cache = message.client.users.cache;
            const allPlayers = table.game.players.map(player=>cache.get(player[0].id));
            Promise.all(
                allPlayers.map( async player =>{
                    return await whisperVote(player);
                })
            ).then((votes) =>{
                const results = votes.reduce((result, vote)=>{
                    result[vote?0:1]++
                    return result;
                }, [0,0]);
                message.channel.send(
                    "Accusation Results:\n"+
                    `yeses:${results[0]}\n`+
                    `nos: ${results[1]}`
                    )
            });
            return;
        }
        if(args.some(arg => arg.toLowerCase() == "help")){
            message.reply(
                shuffle(table.game.players).reduce((output, player) =>
                    `${output}${player[1].name}:${player[1].ref}\n`
                , '')
            )
            return;
        }
        if(!Dracula.validateOptions(args)){
            message.reply("One of these characters are not available");
            return;
        }
        table.game = new Dracula(table, args);

        const players = table.game.players.map((player)=>
            player[1]
        )
        players.push(table.game.mysteryGuest);
        message.channel.send("Dracula's Feast Started. Included roles are: " +
            shuffle(players).reduce((output, player)=>
                output + player.name + ', '
            ,'').slice(0, -2)
        )

        table.game.players.forEach(player  => {
            let characterSpecific = "";
            switch (player[1].name) {
                case "Zombie":
                    const neighbours = zombieNeighbours(table, player[0]);
                    characterSpecific = "\nYour neighbours are :"+
                        `${neighbours[0].name} and ${neighbours[1].name}`
                    break;
                case "Magic Mirror":
                    characterSpecific = `\nThe Mystery Guest `+
                    `is ${table.game.mysteryGuest.name}`
                    break;
            }
            userCache.get(player[0].id).send(
                `Role:${player[1].name}\n`+
                `Description:${player[1].desc}`+
                characterSpecific
            )            
        });
    }
}