'use strict'

const merge = require('../utils/merge');

/**
 * Uses yargs to generate a hash of the input switches, and then merges it with
 * the current config. yargs can be configured, and then passed into the
 * constructor, or the default instance will be used.
 */
class CliProvider {
    constructor(yargs) {
        this.yargs = yargs || require('yargs');
    }

    build(config) {
        return merge(config, this.yargs.argv);
    }
}

module.exports = CliProvider;
