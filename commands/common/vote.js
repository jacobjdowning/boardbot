const fs = require('fs');

function shuffle(array){ //Definitely move this to a utility module
    for(var i = array.length-1; i>=0; i--){
        let j = parseInt(Math.random() * i);
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array
}

function playSoundRec(connection, left){
    if(!left.length){
        connection.disconnect();
        return;
    }

    const filename = `./assets/sounds/${left.shift()}`;
    const stream = fs.createReadStream( filename )
    const dispatcher = connection.play(stream ,{ type: 'ogg/opus', volume: 1 });

    dispatcher.on('finish', () => {
        playSoundRec(connection, left);
    });

    dispatcher.on('error', (error) => console.error("Error: ", error));
}

async function playSounds(message, soundNames){
    setTimeout(async ()=>{
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            playSoundRec(connection, soundNames);
        }
    }, 5000 + Math.random()*10000);
}

function announceResults(msg, game){
    game.voteState="none";
    let sounds = Array.from(game.votes, ([id, vote]) =>{
        return vote?"success.ogg":"failure.ogg";
    })
    sounds = shuffle(sounds);
    playSounds(msg, sounds).catch(err =>{console.error(err)});
}


module.exports = (pass, game, playerid, msg) => {
    const lastVote = game.safeVote(pass, playerid);
    if (lastVote == "Ineligable"){
        msg.reply("You are ineligable to vote at this time");
        return;
    }
    if(lastVote){
        if (game.voteState == "team"){
            const responseChannel = msg.client.channels
                                    .cache.get(game.responseChannel);

            let breakdownString = "";
            let voteCount = 0;
            game.players.forEach(player => {
                let vote = game.votes.get(player.id);
                breakdownString = breakdownString +
                    `${player.name}: ${vote?':thumbsup:':':thumbsdown:'}\n`;
                voteCount += vote?1:-1;
            });
            breakdownString = breakdownString +"The team vote "+ ((voteCount>0)?
                "Passses!" : "Failed!");
                
            responseChannel.send(breakdownString)

            game.votes.clear();
            
            const cache = msg.client.users.cache;

            if (voteCount > 0) {
                game.voteState = "quest";
                game.proposedTeam.forEach(teammember =>{
                    if(teammember.alignment == "evil"){
                        cache.get(teammember.id).send(
                            "As an evil player you may sabotage the quest with "+
                            "a !fail or let it continue with a !pass"
                        );
                    }else{
                        cache.get(teammember.id).send(
                            "As a good player you have automatically helped "+
                            "the quest succeed"
                        );
                        const voteResult = game.vote(true, teammember.id);
                        if(voteResult == "Ineligable"){
                            console.error("Automatic Vote denied");
                        }else if(voteResult){
                            console.log("Here");
                            announceResults(msg, game);
                        }
                    }
                });
            }else{
                let leader = game.nextLeader; // Move to common?
                cache.get(leader.id).send(
                    "You have been chosen to lead the next mission. "+
                    "Propose your team with command \"!team\" followed by "+
                    "the usernames of the team members you want to go on the "+
                    "mission. The next mission requires "+
                    `${game.currMissionCount} team members` 
                )
                game.voteState = "none";
            }
        }else if(game.voteState == "quest"){
            announceResults(msg,game);
        }
    }
}