//TODO: Allow for some kind of assertion at the end of a test
const realDiscord = require('discord.js');

function mockLog(content){
    console.log(`[Mock]${content}`);
}

class Channel{
    constructor(id, type){
        this.type = type? type:'text';
        this.id = `c${id}`;
    }

    send(content){
        mockLog(`[Text.${this.id}]${content}`);
    }

}

class User{
    constructor(id, username){
        this.username = username?username:`u${id}:USERNAME`;

        this.id = `u${id}`;
        this.bot = false;
    }

    send(content){
        mockLog(`[DM.${this.id}]${content}`);
    }

}

class Message{
    static nextID = 0;
    constructor(client, channel, author, content){
        this.channel= channel;
        this.client= client;
        this.author= author;
        this.content = content 
        this.id = `m${Message.nextID++}`;
    }

    reply(content){
        const mention = this.channel.type!='dm'?`@${this.author.username}`:'';
        mockLog(`[${this.channel.type}.${this.channel.id}]`+
            `${mention} ${content}`);
    }
}

class Client{
    constructor(){
        this.hooks = {
            'ready': null,
            'message': null
        }
        this.self = new User(-1, 'bot');
        this.self.bot = true;
        this.users = {};
        this.channels = {};
        this.users.cache = new realDiscord.Collection();
        this.channels.cache = new realDiscord.Collection();
    }

    setTest(test){
        this.test = test;
    }

    login(token){
        this.hooks['ready']();
        //run tests here
        const messages = require(`./${this.test}.js`);
        messages.forEach(outline => {
            if(!this.channels.cache.has(`c${outline.channel.id}`)){
                const channel = new Channel(outline.channel.id, outline.channel.type)
                this.channels.cache.set(channel.id, channel); 
            }
            if(!this.users.cache.has(`u${outline.author.id}`)){
                let user = new User(outline.author.id, outline.author.username);
                this.users.cache.set(user.id, user);
            }
            this.hooks['message'](
                new Message(this,
                    this.channels.cache.get(`c${outline.channel.id}`),
                    this.users.cache.get(`u${outline.author.id}`),
                    outline.content)
            );
        });
    }

    on(hookname, callback){
        this.hooks[hookname]=callback;
    }
}

module.exports = {
    "Client": Client,
    "Collection": realDiscord.Collection
}