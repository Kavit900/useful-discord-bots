#### Errors

**Error**
```
TypeError [CLIENT_MISSING_INTENTS]: Valid intents must be provided for the Client.
    at Client._validateOptions (/Users/kavit.mehta/work-career/discord-bots/leetcode-bot/node_modules/discord.js/src/client/Client.js:544:13)
    at new Client (/Users/kavit.mehta/work-career/discord-bots/leetcode-bot/node_modules/discord.js/src/client/Client.js:73:10)
    at Object.<anonymous> (/Users/kavit.mehta/work-career/discord-bots/leetcode-bot/main.js:3:13)
    at Module._compile (node:internal/modules/cjs/loader:1095:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1147:10)
    at Module.load (node:internal/modules/cjs/loader:975:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  [Symbol(code)]: 'CLIENT_MISSING_INTENTS'
}
```

**Fix**

```
const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
```
