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

```bash
npm test
```

runs all test files that end in .test.js in folder test or child folders.
Tests should be executed through the included mock version of Discord js. This mock takes in a list of message objects that represent messages from users and 
returns a log of all incoming and outgoing messages from the server if those messages were sent sequentially.


## Contributing
Pull requests are welcome. As a general rule game states are saved in objects defined in /games and do not interact with discord.js.
Responses to messages via Discord.js are handled in command files under /commands

A good first contribution might be adding another game you think will work well in the format.

## License
[MIT](https://choosealicense.com/licenses/mit/)
