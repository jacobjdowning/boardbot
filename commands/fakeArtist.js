module.exports = {
    "name":"fakeartist",
    "execute": (message, args, table) => {
        console.log("we Got HERE !!!!!")
        if (message.channel.type == 'text'){
            //Select a fake artist
            console.log("We got here")
            const teamsArray = Array.from(table.teams.values())
            const fakesTeam = teamsArray[Math.floor(Math.random()*teamsArray.length)]
            const fakePlayer = fakesTeam[Math.floor(Math.random()*fakesTeam.length)]
            const fakeUser = message.client.users.cache.get(fakePlayer.id);
            fakeUser.send("You are the Fake Artist!")
            //Send the fake artist a response
        }else{
            message.reply("games must be started inside a text channel")
        }
    }
}
