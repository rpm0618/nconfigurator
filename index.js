'use strict'

var LiteralProvider = require('./lib/providers/literal-provider');
var Configurator = require('./lib/configurator')

function main() {
    let configurator = new Configurator();
    configurator.register('literal', LiteralProvider);

    configurator.use('literal', {Hello: 'World'});

    configurator.build().then(function(config) {
        console.log(config);
    }).catch(function(err) {
        console.error(err.stack);
    });
}

main();
