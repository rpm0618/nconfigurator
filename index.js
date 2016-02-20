'use strict'

var LiteralProvider = require('./lib/providers/literal-provider');
var CliProvider = require('./lib/providers/cli-provider');
var Configurator = require('./lib/configurator');

function main() {
    let configurator = new Configurator();
    configurator.register('literal', LiteralProvider);
    configurator.register('cli', CliProvider);

    configurator.use('literal', {Hello: 'World'});
    configurator.use('cli');

    configurator.build().then(function(config) {
        console.log(config);
    }).catch(function(err) {
        console.error(err.stack);
    });
}

main();
