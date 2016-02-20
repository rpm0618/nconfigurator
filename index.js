'use strict'

const LiteralProvider = require('./lib/providers/literal-provider');
const CliProvider = require('./lib/providers/cli-provider');
const FileProvider = require('./lib/providers/file-provider');
const EnvProvider = require('./lib/providers/env-provider');
const Configurator = require('./lib/configurator');

function main() {
    let configurator = new Configurator();
    configurator.register('literal', LiteralProvider);
    configurator.register('cli', CliProvider);
    configurator.register('file', FileProvider);
    configurator.register('env', EnvProvider);

    configurator.use('literal', {Hello: 'World'});
    configurator.use('cli');
    configurator.use('file', {fromConfig: 'file', skipMissing: true});
    configurator.use('env', {match: /compute.name/, lowerCase: true});

    configurator.build().then(function(config) {
        console.log(config);
    }).catch(function(err) {
        console.error(err.stack);
    });
}

main();
