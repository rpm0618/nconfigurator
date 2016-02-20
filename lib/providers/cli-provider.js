'use strict'

module.exports = class CliProvider {
    constructor(yargs) {
        this.yargs = yargs || require('yargs');
    }

    build(config) {
        return Object.assign(config, this.yargs.argv);
    }
}
