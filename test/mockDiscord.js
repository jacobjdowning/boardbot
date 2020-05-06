//TODO: Allow for some kind of assertion at the end of a test
const realDiscord = require('discord.js');
const sleep = require('util').promisify(setTimeout);

function mockLog(content){
    console.log(`[Mock]${content}`);
}

class Collector{ //Only options supported are time and max
    constructor(resolve, filter, options){
        this.resolve = resolve;
        this.filter = filter;
        this.max = options.max;
        if (options.time != null) {
            setTimeout(this.end, options.time);    
        }
        this.collected = new realDiscord.Collection();
    }

    collect(message){
        if(this.filter(message)){
            this.collected.set(message.id, message)
            if(this.max != null && this.max <= this.collected.size){
                this.resolve(this.collected);
            }
        }
    }

    end(){
        this.resolve(this.collected);
    }
}

class StreamDispatcher{
    constructor(stream, options){
        let empty = ()=>{console.log("Nothing here")};
        this.hooks = {
            'debug': empty,
            'start': empty,
            'finish': empty,
            'error': empty
        }
        this.stream = stream
    }

    on(name, callback){
        this.hooks[name] = callback;
    }

    play(){
        this.hooks['start']();
        mockLog(`Playing audio from${this.stream.path}`);
        setTimeout(()=>{this.hooks['finish']()}, 10);
    }
}

class VoiceConnection{
    constructor(channel){
        this.connected = true;
        this.channel = channel
    }

    play(stream, options){
        let dispatch = new StreamDispatcher(stream, options)
        setTimeout(()=>{dispatch.play()}, 0);
        return dispatch;
    }

    disconnect(){
        if (!this.connected){
            console.error("Tried to disconnect while not connected");
            return;
        }
        this.connected = false;
        mockLog(`Disconnecting from ${this.channel.id}`);
    }
}

class Member{
    static nextID = 0;
    constructor(user, voiceChannelID){
        this.user = user;
        this.voice = {};
        this.voice.channel = new Channel(
            voiceChannelID?voiceChannelID:`v${Member.nextID++}`,
            "voice");
    }
}

class Channel{
    constructor(id, type, guild){
        this.type = type? type:'text';
        this.id = `c${id}`;
        this.guild = guild;
        this.collectors = [];
    }

    async send(content){
        mockLog(`[Text.${this.id}]${content}`);
        return;
    }

    awaitMessages(filter, options){
        const self = this;
        return new Promise(resolve =>{
            self.collectors.push(new Collector(resolve, filter, options));
        });
    }

    async join(){
        if(this.type != 'voice'){
            console.error("Cannont join non-voice channel");
            return;
        } 
        mockLog(`Connecting to voice channel ${this.id}`)
        return new VoiceConnection(this);
    }

}

class User{
    constructor(id, username){
        this.username = username?username:`u${id}:USERNAME`;
        
        this.id = `u${id}`;
        this.bot = false;
        this.dmChannel = new Channel(`DM${this.id}`)
    }

    send(content){
        this.dmChannel.send(content);
    }

}

class Message{
    static nextID = 0;
    constructor(client, channel, author, member, content){
        this.channel= channel;
        this.client= client;
        this.author= author;
        this.content = content 
        this.member = member;
        this.id = `m${Message.nextID++}`;
    }

    reply(content){
        const mention = this.channel.type!='dm'?`@${this.author.username}`:'';
        mockLog(`[${this.channel.type}.${this.channel.id}]`+
            `${mention} ${content}`);
    }
}

class Guild{
    constructor(client, id){
        this.members = {};
        this.members.cache = new realDiscord.Collection();
        this.id = `g${id}`;
        this.available = true;
        this.client = client;
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
        this.guilds = {};
        this.users.cache = new realDiscord.Collection();
        this.channels.cache = new realDiscord.Collection();
        this.guilds.cache = new realDiscord.Collection();
        
    }

    setTest(test){
        this.test = test;
    }

    _message(outline){
        let member;
        let guild = "NEVER CHANGED";
        if(!this.users.cache.has(`u${outline.author.id}`)){
            let user = new User(outline.author.id, outline.author.username);
            this.users.cache.set(user.id, user);
        }
        if(outline.channel.id == "dm"){
            member = null;
            guild = null;
        }else{
            if (!outline.guild){
                outline.guild = {}
                outline.guild.id = 0
            }
            if(!this.guilds.cache.has(`g${outline.guild.id}`)){
                let guild = new Guild(this, outline.guild.id);
                this.guilds.cache.set(guild.id, guild);
            }
            guild = this.guilds.cache.get(`g${outline.guild.id}`);
            if(!guild.members.cache.has(`u${outline.author.id}`)){
                member = new Member(
                    this.users.cache.get(`u${outline.author.id}`),
                    outline.author.vid);
                guild.members.cache.set(member.user.id, member);
            }
        }
        if(!this.channels.cache.has(`c${outline.channel.id}`)){
            const channel = new Channel(outline.channel.id,
                                        outline.channel.type,
                                        guild);
            this.channels.cache.set(channel.id, channel); 
        }
        const channel = outline.channel.id == "dm" ?
            this.users.cache.get(`u${outline.author.id}`).dmChannel :
            this.channels.cache.get(`c${outline.channel.id}`);
        const msg = new Message(this,
            channel,
            this.users.cache.get(`u${outline.author.id}`),
            member,
            outline.content);

        channel.collectors.forEach(collector =>{
            collector.collect(msg);
        });
        this.hooks['message'](msg);
    }

    async _messages(messages){
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            this._message(message);
            await sleep(0);
        }
        return;
    }

    login(token){
        if(token == null){
            console.log("No Token given");
            return;
        }
        this.hooks['ready']();
        //run tests here
        const messages = require(`./${this.test}.js`);
        this._messages(messages);
    }

    on(hookname, callback){
        this.hooks[hookname]=callback;
    }
}

module.exports = {
    "Client": Client,
    "Collection": realDiscord.Collection
}