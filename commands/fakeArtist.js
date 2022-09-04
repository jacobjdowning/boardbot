module.exports = {
    "name":"fakeartist",
    "execute": (message, args, table) => {
        if (message.channel.type == 'text'){
            //Select a car
            //Select a fake artist
            const teamsArray = Array.from(table.teams.values())
            const fakesTeam = teamsArray[Math.floor(Math.random()*teamsArray.length)]
            const fakePlayer = fakesTeam[Math.floor(Math.random()*fakesTeam.length)]
            const fakeUser = message.client.users.cache.get(fakePlayer.id);
            //Send the fake artist a response
            fakeUser.send("You are the Fake Artist!")
            //Send the rest of the responses
        }else{
            message.reply("games must be started inside a text channel")
        }
    }
}
