const fs = require('fs');

function startRound(msg, game){
    const cache = msg.client.users.cache;
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

function shuffle(array){ //Definitely move this to a utility module
    for(var i = array.length-1; i>=0; i--){
        let j = parseInt(Math.random() * i);
        let x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array
}

function playSoundRec(connection, left, end){
    if(!left.length){
        connection.disconnect();
        end();
        return;
    }

    const filename = `./assets/sounds/${left.shift()}`;
    const stream = fs.createReadStream( filename )
    const dispatcher = connection.play(stream ,{ type: 'ogg/opus', volume: 1 });

    dispatcher.on('finish', () => {
        playSoundRec(connection, left, end);
    });

    dispatcher.on('error', (error) => console.error("Error: ", error));
}

function playSounds(message, table, soundNames, end){
    const timeTaken = 8000 + Math.random()*10000
    let member = table.guild.members.cache.get(message.author.id)
    if(member == null){
        console.error("Vote from user who is not a member of the guild"+
                        "where the table for this game is setup");
        return
    }
    if (member.voice.channel) {
        setTimeout(()=>{
            member.voice.channel.join().then(connection =>{
                playSoundRec(connection, soundNames, end);
            }, (err)=>{console.log(err)});
        }, timeTaken);
    }else{
        console.log("Voice channel inaccessable");
    }
}
// Why are these two seporate functions? ^ and v
// instead of using "end function" somehow make this a promise
function announceResults(message, table, game, end){
    let sounds = Array.from(game.votes, ([id, vote]) =>{
        return vote?"success.ogg":"failure.ogg";
    })
    sounds = shuffle(sounds);
    sounds.unshift("ready.ogg");
    playSounds(message, table, sounds, end);
}


module.exports = (pass, game, playerid, msg, table) => {
    const lastVote = game.safeVote(pass, playerid);
    if (lastVote == "Ineligable"){
        msg.reply("You are ineligable to vote at this time");
        return;
    }
    msg.reply("Vote registered"); //Maybe move
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

            const cache = msg.client.users.cache;

            game.votes.clear();
        
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
                            announceResults(msg, table, game, () =>{
                                startRound(msg, game);
                            });
                            game.curQuest++;
                            // startRound(msg, game);
                        }
                    }
                });
            }else{
                startRound(msg,game);
            }
        }else if(game.voteState == "quest"){
            announceResults(msg,table,game, ()=>{
                startRound(msg, game);
            });
            game.curQuest++;
            // startRound(msg, game);
        }
    }
}