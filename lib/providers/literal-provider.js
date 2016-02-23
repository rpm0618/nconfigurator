'use strict'

const _ = require('lodash');
const merge = require('../utils/merge');

/**
 * Merges an object literal with the current config
 */
class LiteralProvider {
    constructor(literal) {
        this.literal = literal;
    }

    build(config) {
        return merge(config, this.literal);
    }
}

module.exports = LiteralProvider
