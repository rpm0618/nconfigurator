'use strict'

/**
 * Merges an object literal with the current config
 */
class LiteralProvider {
    constructor(literal) {
        this.literal = literal;
    }

    build(config) {
        return Object.assign(config, this.literal);
    }
}

module.exports = LiteralProvider
