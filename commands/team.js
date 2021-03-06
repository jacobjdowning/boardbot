const fs = require('fs');
const sleep = require('util').promisify(setTimeout);

function startRound(client, game){
    const cache = client.users.cache;
    const leader = game.nextLeader; // Move to common?
    cache.get(leader.id).send(
        "You have been chosen to lead the next mission. "+
        "Propose your team with command \"!team\" followed by "+
        "the usernames of the team members you want to go on the "+
        "mission. The next mission requires "+
        `${game.currMissionCount} team members` 
    )
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

function announceResults(votes, user, table, end){
    let sounds = votes.map(vote => vote?"success.ogg":"failure.ogg");
    sounds = shuffle(sounds);
    sounds.unshift("ready.ogg");
    const member = table.guild.members.cache.get(user.id);
    if(member == null){
        console.error("Vote from user who is not a member of the guild "+
                        "where the table for this game is setup");
        return;
    }
    if (member.voice.channel) {
        member.voice.channel.join().then(connection =>{
            playSoundRec(connection, sounds, end);
        }, (err)=>console.log(err));
    }else{
        console.log("Voice channel inaccessable");
    }
}

async function questVote(player, alignment){
    const channel = player.dmChannel;
    if(alignment == 'good'){
        await channel.send("As a good player you have automatically "+
        "helped the mission succeed");
        await sleep(15000);
        return true;
    }
    if(alignment == 'evil'){
        await channel.send("As an evil player you have 15 seconds to type "+
        "!fail if you'd like to sabatoge the mission, otherwise a success will "+
        "be issued");
        let collection = await channel.awaitMessages((m => 
            m.content.toLowerCase().includes('!fail')), {time:15000});
        return collection.size==0;
    }
    console.error("Invalid alignment");
}

async function startQuestVote(allPlayers, table, client){
    const teamPlayers = allPlayers.filter(player => 
        table.game.proposedTeam.some(element => {
            return element.id == player.id
        }));
    const votes = await Promise.all(
        teamPlayers.map(async player =>{
            const alignment = table.game.players.filter(
                (item) => item.id == player.id
            )[0].alignment;
            return await questVote(player, alignment);
        })
    );
    announceResults(votes, allPlayers[0], table, ()=>{
        startRound(client, table.game);
    })//move into main async
    return;
}

async function teamVote(player, teamString){
    const channel = player.dmChannel;//might be null!!!
    await channel.send(`The proposed team is ${teamString}. `+
        "Respond with !pass or !fail. "+
        "This response will be public.");
    let collection = await channel.awaitMessages(m => {
        return m.content == '!pass' || m.content == '!fail'
    }, {max:1}); // probably should have a time limit
    return [player, collection.first().content == '!pass'];
}

async function startTeamVote(allPlayers, teamString, table, msg){
    const votes = await Promise.all(
        allPlayers.map( async player =>{
            return await teamVote(player, teamString);
        })
    );
    
    const success = votes.reduce((acc, cur, i, src)=>{
        let voteCount = acc + (cur[1]?1:-1);
        if(i==src.length-1){
            return voteCount >= 0;
        }
        return voteCount;
    }, 0);
    msg.channel.send(votes.reduce((acc, cur, i, src) =>{
        return acc + `${cur[0].username}: ${cur[1]?':thumbsup:':':thumbsdown:'}\n` +
        (i==src.length-1?`The team vote ${success?'Passes':'Failed'}!`:'');
    }, ''));

    if (success) { //move this into main async
        table.game.failedVotes = 0;
        await startQuestVote(allPlayers, table, msg.client);
    }else{
        table.game.failedVotes++;
        startRound(msg.client, table.game);
    }
}

module.exports = {
    "name": "team",
    "onlygame": "avalon",
    "execute": (msg, args, table) =>{
        if(msg.channel.type == "dm"){
            msg.reply("Team proposals should be public please enter this "+
            "in a public chat channel");
            return;
        }
        if (args.length != table.game.currMissionCount){
            msg.reply("There in an incorrect number of members on this team, "+
                    `there should be ${table.game.currMissionCount}.`);
            return;
        }
        if (table.game.currLeader.id != msg.author.id){
            msg.reply("Only team leaders can propse a team");
            return;
        }

        //somewhere check that there isn't already a team being voted on
        msg.reply("Team vote sent");

        const players = table.game.players;
        let team = [];
        let error = false;
        args.forEach(teammate => {
           for (let i = 0; i < players.length; i++) {
                if (players[i].name == teammate){
                      team.push(players.splice(i,1).shift());
                      return;              
                }
           }
           msg.reply(`${teammate} is not in the game, please try again`);
           error = true;
        });
        if (error) return;
        
        const cache = msg.client.users.cache;
        const allPlayers = table.game.players.map(player=>cache.get(player.id));

        let teamString = "";
        team.forEach((teammember, i) => {
            teamString = teamString + (i?", ": "") + teammember.name; 
        });
        table.game.setProposedTeam(team);

        startTeamVote(allPlayers, teamString, table, msg)
            .catch(err => console.error(err));
    }
}