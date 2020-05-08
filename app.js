const fs = require('fs');

const isTest = process.argv[2] == '--test';
const Discord = require(isTest?'./test/mockDiscord.js':'discord.js');
const Table = require('./table.js');
const client = new Discord.Client();
if(isTest) { client.setTest(process.argv[3]); }
const token = require('./token.js');
const tables = new Map();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands') .filter(file => {
    return file.endsWith('.js');
});

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);//TODO: add warning for having two commands with the same name
});

client.on('ready', () => {
    console.log('Logged in as BoardBoat');
});

client.on('message', message =>{
    if(!message.content.startsWith('!') || message.author.bot) return;
    const args = message.content.slice(1).split(' ');
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    //find correct table
    let table = null;
    if(message.channel.type = "text"){
        if (tables.has(message.channel.id)){
            table = tables.get(message.channel.id);
        } else {
            table = new Table(""); // Should have some kind of name
            tables.set(message.channel.id, table);
        }
    }else if(message.channel.type = "dm"){
        if (Table.playerConnections.has(message.author.id)){
            table = Table.playerConnections.get(message.author.id);
        } else {
            message.reply("You are not currently sitting at a table\n"+
                "Please use the !join command in a guild channel "+
                "with the bot available to join a table");
            return;
        }
    }else{
        console.error(`Command ${command} came from something`+ 
            "other than text or dm");
        return;
    }

    client.commands.get(command).execute(message, args, table);
    //TODO: Enforce onlyGame property
    //TODO: Add DM only or public Channel only properties
});

client.login(token);