'use strict'

const LiteralProvider = require('./lib/providers/literal-provider');
const CliProvider = require('./lib/providers/cli-provider');
const FileProvider = require('./lib/providers/file-provider');
const EnvProvider = require('./lib/providers/env-provider');
const Configurator = require('./lib/configurator');

const merge = require('./lib/utils/merge');

function main() {
    let configurator = new Configurator();

    // Register all of the builtin providers
    configurator.register('literal', LiteralProvider);
    configurator.register('cli', CliProvider);
    configurator.register('file', FileProvider);
    configurator.register('env', EnvProvider);

    configurator.utils = { merge };

    return configurator;
}

module.exports = main();
