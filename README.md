# nconfigurator

A modern, modular node.js configuration library. Basically what would happen if
`nconf` and `express` had a baby, with some promises thrown in for good measure.

### Example

```javascript
const Configurator = require('nconfigurator');

Configurator.use('literal', {numberOfMonsters: 10});
Configurator.use('cli');

Configurator.build()
    .then(dungeonConfig => {
        //dungeonConfig is just a plain JS object. No fancy getters or setters.
        console.log("Number of Monsters: " + dungeonConfig.numberOfMonsters});
        generateDungeon(dungeonConfig);
    }).catch(err => {
        console.error("Error configuring dungeon: " + err.stack);
    });
```

This snippet will read a `--numberOfMonsters` command line option, and use a
default of `10`.

### Better Example

Now you might say

> Wouldn't it better to use an option parser like `yargs` for some thing like
> this?

And you would be right. (In fact, `nconfigurator` uses `yargs` internally). The
power of `nconfigurator` comes in when you want to, say, also take configuration
from an environment variable, or a file:

```javascript
Configurator.use('literal', {numberOfMonsters: 10});
Configurator.use('file', {file: 'config.json', skipMissing: true});
Configurator.use('env', {whitelist: ['numberOfMonsters', 'monsterStrength']});
Configurator.use('cli');
```

Boom. Command line arguments taking precedence over environment variables taking
precedence over a config file (which might not be there), taking precedence over
default values. In four lines of code.

### Best Example

That's nice and all, but where `nconfigurator` really shines (and the main
reason I wrote it) is extensibility. Say you want to package your dungeon
generator as a micro-service (because your DM wants to integrate it into his/her
RPG engine), and you would like to take your configuration from a central
server. This is simple with `nconfigurator`. First you define a provider:

```javascript
class DungeonProvider {

    constructor(server) {
        this.serverUrl = server;
    }

    // build takes in the current configuration, and returns a promise that
    // fulfills to the new one. This allows you to do what's shown below, where
    // we take a previously set config value and use it in this step. This also
    // means that you have merge the two config objects yourself. nconfigurator
    // provides an implementation based on lodash's merge that does sane things,
    // but it's entirely up to you.
    build(config) {
        return getConfigFromServer(config.serverUrl || this.serverUrl)
            .then(serverConfig => {
                return Configurator.utils.merge(config, serverConfig);
            });
    }
}
```

Next, register your provider with `nconfigurator`, and use it:

```javascript
Configurator.register('dungeon', DungeonProvider);
Configurator.use('dungeon', 'http://dungeon.com/get/config');
```

Alternatively, you can just use the provider directly:

```javascript
Configurator.use(new DungeonProvider('http://dungeon.com/get/config'));
```
# Documentation

`nconfigurator` comes with four built in providers:

### LiteralProvider

Registered under `literal`, this provider simply merges a JS object with the
current config:

```javascript
Configurator.use('literal', {numberOfMonsters: 10});
```

### FileProvider

Registered under `file`, this provider parses a JSON file and merges it with
the current config. If the file it's given is a direcotry, it will read all of
the files in that directory and merge them together. It either takes a path to
the file, or an options object that can have the following properties:

- `file`: The path to the file/directory to read
- `fromConfig`: Get the file path from this value of the already built config.
If both `file` and `fromConfig` are given, `fromConfig` is used
- `skipErrors`: Silently ignore any errors that occur parsing the JSON file.
- `skipMissing`: Silently ignore any missing files or config values.

```javascript
Configurator.use('file', {file: 'config.json', skipMissing: true});
```

### EnvProvider

Registered under `env`, this provider takes in environment variables, and adds
them to the current config. Custom name filtering and mapping is comming soon!

- `whitelist`: Only bring in environment variables that have these names
- `lowerCase`: If set to true, lowercase all of the environment variable names
- `regex`: Filter the allowed environment variables by matching their name to a
regular expression.

```javascript
Configurator.use('env', {whitelist: ['numberOfMonsters', 'monsterStrength']});
```

### CliProvider

Registered under `cli`, this provider parses the command line using `yargs`, and
merges the resulting object into the config. Any customizations can be made to
`yargs`, and the resulting object passed to the provider as a parameter (for
generating help strings, for instance

```javascript
Configurator.use('cli', require('yargs').usage('$0 --numberOfMonsters <num>'));
```
**Note:** The `yargs` object doesn't technically have to be passed as a parameter.
Changes made on the module will persist across files. However, passing it along
declares intent, so I encourage you to do so.
