# boardbot
A Discord bot for distributing hidden information to facilitate playing board games over Discord

## Installation

```bash
npm install
```

## Usage

token.js must be included in the root with a discord bot key
```javascript
module.exports = 'TOKEN'
```
To start bot locally
```bash
node app.js
```

## Testing

A Mock version of Discord.js is included. 
```bash
npm run --test TestName
```
will run TestName.js from the test folder. Tests are lists of message objects that represent messages that might come from users on
a sever from which the bot is listening.

## Contributing
Pull requests are welcome. As a general rule game states are saved in objects defined in /games and do not interact with discord.js.
Responses to messages via Discord.js are handled in command files under /commands

A good first contribution might be adding another game you think will work well in the format.

## License
[MIT](https://choosealicense.com/licenses/mit/)
